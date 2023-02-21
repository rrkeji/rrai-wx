import mimeMap from './mime-map';
/**
 * 
 */
export class FormData {
  fileManager: WechatMiniprogram.FileSystemManager = wx.getFileSystemManager();
  data: any = {};
  files: any = [];

  append(name: string, value: any) {
    this.data[name] = value;
    return true;
  }

  appendFile(name: string, path: string, fileName: string) {
    let buffer = this.fileManager.readFileSync(path);
    if (Object.prototype.toString.call(buffer).indexOf("ArrayBuffer") < 0) {
      return false;
    }

    if (!fileName) {
      fileName = getFileNameFromPath(path);
    }

    this.files.push({
      name: name,
      buffer: buffer,
      fileName: fileName
    });
    return true;
  }
  getData() {
    return convert(this.data, this.files);
  }
}

function getFileNameFromPath(path: string) {
  let idx = path.lastIndexOf("/");
  return path.substr(idx + 1);
}

function convert(data: any, files: any) {
  let boundaryKey = 'wxmpFormBoundary' + randString(); // 数据分割符，一般是随机的字符串
  let boundary = '--' + boundaryKey;
  let endBoundary = boundary + '--';

  let postArray: Array<number> = [];

  //拼接参数
  if (data && Object.prototype.toString.call(data) == "[object Object]") {
    for (let key in data) {
      postArray = postArray.concat(formDataArray(boundary, key, data[key]));
    }
  }
  //拼接文件
  if (files && Object.prototype.toString.call(files) == "[object Array]") {
    for (let i in files) {
      let file = files[i];
      postArray = postArray.concat(formDataArray(boundary, file.name, file.buffer, file.fileName));
    }
  }
  //结尾
  let endBoundaryArray = [];
  endBoundaryArray.push(...toUtf8Bytes(endBoundary));
  postArray = postArray.concat(endBoundaryArray);
  return {
    contentType: 'multipart/form-data; boundary=' + boundaryKey,
    buffer: new Uint8Array(postArray).buffer
  }
}

function randString() {
  var result = '';
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (var i = 17; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function formDataArray(boundary: string, name: string, value: any, fileName?: string): Array<number> {
  let dataString = '';
  let isFile = !!fileName;

  dataString += boundary + '\r\n';
  dataString += 'Content-Disposition: form-data; name="' + name + '"';
  if (isFile) {
    dataString += '; filename="' + fileName + '"' + '\r\n';
    dataString += 'Content-Type: ' + getFileMime(fileName!) + '\r\n\r\n';
  } else {
    dataString += '\r\n\r\n';
    dataString += value;
  }

  var dataArray = [];
  dataArray.push(...toUtf8Bytes(dataString));

  if (isFile) {
    let fileArray = new Uint8Array(value);
    dataArray = dataArray.concat(Array.prototype.slice.call(fileArray));
  }
  dataArray.push(...toUtf8Bytes("\r"));
  dataArray.push(...toUtf8Bytes("\n"));

  return dataArray;
}

function getFileMime(fileName: string) {
  let idx = fileName.lastIndexOf(".");
  let mime = mimeMap[fileName.substr(idx)];
  return mime ? mime : "application/octet-stream"
}

const toUtf8Bytes = (str: string): Array<any> => {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    bytes.push(...utf8CodeAt(str, i));
    if (str.codePointAt(i) > 0xffff) {
      i++;
    }
  }
  return bytes;
}
/**
 * 
 * @param str 
 * @param i 
 */
const utf8CodeAt = (str: string, i: number): Array<number> => {
  var out = [], p = 0;
  var c = str.charCodeAt(i);
  if (c < 128) {
    out[p++] = c;
  } else if (c < 2048) {
    out[p++] = (c >> 6) | 192;
    out[p++] = (c & 63) | 128;
  } else if (
    ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
    ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
    // Surrogate Pair
    c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
    out[p++] = (c >> 18) | 240;
    out[p++] = ((c >> 12) & 63) | 128;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  } else {
    out[p++] = (c >> 12) | 224;
    out[p++] = ((c >> 6) & 63) | 128;
    out[p++] = (c & 63) | 128;
  }
  return out;
};


export default FormData;
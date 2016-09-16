export function post(url, data, callback, errCallback) {
  var req = new XMLHttpRequest();
  req.onload = callback;
  req.onerror = errCallback;
  req.open('post', url, true);
  req.setRequestHeader("Content-Type", 'application/json;charset=UTF-8');
  req.send(JSON.stringify(data));
}
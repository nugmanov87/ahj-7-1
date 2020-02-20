export default function initData() {
  const params = new URLSearchParams();
  params.append('name', 'Поменять краску');
  params.append('description', 'Поменять краску в ринтере, ком404');

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://ahj-7-1-1.herokuapp.com/');
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
    // TODO: handle other status
      console.log(xhr.responseText);
    }
  });
  xhr.send(params);
}

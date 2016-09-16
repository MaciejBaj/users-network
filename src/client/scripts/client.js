import App from '../../app';
import '../styles/style.css';

var attachElement = document.getElementById('react-app');


const app = new App({state: {
  user: {
    login: '',
    password: ''
  }
}});

app.renderToDOM(attachElement);
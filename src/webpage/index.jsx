import './css/index.css';
import {createRoot} from 'react-dom/client'
import App from "./elements/App.jsx"

const root = createRoot(document.getElementById("root"))

root.render(
    <App />
)
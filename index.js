import comment from './src/components/comment'
import _Vue from 'vue'
import './src/assets/css/base.css'
import './src/assets/icon/style.css'

comment.install = Vue => {
if (!Vue) {
    window.Vue = Vue = _Vue
}
    Vue.component(comment.name, comment)
}
export default comment;
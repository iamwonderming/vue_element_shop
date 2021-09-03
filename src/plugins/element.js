import Vue from 'vue'
import { Button } from 'element-ui'
import {
  Form, FormItem, Input, Message, header, Aside, Main, Container, Submenu, MenuItem, Menu, MenuItemGroup, BreadcrumbItem, Breadcrumb, Card, Row, Col
  , Table, TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Cascader,
  Tree,Select,Option,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,Checkbox,Upload,Timeline,TimelineItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

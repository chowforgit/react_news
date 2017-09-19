import React from 'react';
import { Row, Col } from 'antd';
import { Menu, Icon, Tabs,
         message, Form, Input,
         Button, CheckBox, Modal } from 'antd';
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const MenuItemGroup = Menu.ItemGroup;
import {Router, Route, Link, browserHistory} from 'react-router'

class MobileHeader extends React.Component {

    constructor(){
        super();
        this.state = {
            current: 'top',
            modalVisible: false,
            action: 'login',
            hasLogined: false,
            userNickName: '',
            userid: 0
        };
    };
    componentWillMount(){
        if(localStorage.userid!='') {
            this.setState({hasLogined: true});
            this.setState({userNickName: localStorage.userNickName, userid: localStorage.UserId});
        }
    };
    setModalVisible(value){
        this.setState({
            modalVisible: value
        });
    };
    handleClick(e){
        if(e.key="register") {
            this.setState({current: 'register'});
            this.setModalVisible(true);
        } else {
            this.setState({current: e.key});
        }
    };
    handleSubmit(e){
        e.preventDefault();
        var myFetchOptions = {
            method: 'GET'
        };
        var formData = this.props.form.getFieldsValue();
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action="+this.state.action
        +"&username="+formData.userName+"&password="+formData.password
        +"&r_userName="+formData.r_userName+"&r_password="
        +formData.r_password+"&r_confirmPassword="
        +formData.r_confirmPassword,myFetchOptions)
        .then(response=>response.json())
        .then(json=>{
            this.setState({userNickName: json.NickUserName, userid: json.UserId});
            localStorage.userid = json.UserId;
            localStorage.userNickName = json.NickUserName;
        });
        if (this.state.action=="login") {
            this.setState({hasLogined: true});
        }
        message.success("请求成功!");
        this.setModalVisible(false);
    };
    login(){
        this.setModalVisible(true);
    };
    callback(key){
        if (key==1) {
            this.setState({action: 'login'});
        } 
        else if (key==2) {
            this.setState({action: 'register'});
        }
    };
    logout(){
        localStorage.userid = '';
        localStorage.userNickName = '';
        this.setState({hasLogined: false});
    };

	render() {
        let {getFieldDecorator} = this.props.form;
        const userShow = this.state.hasLogined ?
        <Link to={`/usercenter`}>
            <Icon type="inbox" />
        </Link>
        :
        <Icon type="setting" onClick={this.login.bind(this)}/>

		return (
            <div id="mobileheader">
                <header>
                    <a href="/" >
                        <img src="./src/images/logo.png" alt="logo" />
                        <span>ReactNews</span>
                    </a>

                    {userShow}
                </header>
                <Modal title="用户中心" wrapClassName="vertical-center-modal" visible={this.state.modalVisible} onCancel={()=>this.setModalVisible(false)} onOk={()=>this.setModalVisible(false)} okText="关闭">
                    <Tabs type="card" onChange={this.callback.bind(this)}>
                        <TabPane tab="登录" key="1">
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <FormItem label="账户">
                                    <Input placeholder="请输入您的账号" {...getFieldDecorator('userName')}/>
                                </FormItem>
                                <FormItem label="密码">
                                    <Input type="password" placeholder="请输入您的密码" {...getFieldDecorator('password')}/>
                                </FormItem>
                                <Button type="primary" htmlType="submit">登录</Button>
                            </Form>
                        </TabPane>
                        <TabPane tab="注册" key="2">
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <FormItem label="账户">
                                    <Input placeholder="请输入您的账号" {...getFieldDecorator('r_userName')}/>
                                </FormItem>
                                <FormItem label="密码">
                                    <Input type="password" placeholder="请输入您的密码" {...getFieldDecorator('r_password')}/>
                                </FormItem>
                                <FormItem label="确认密码">
                                    <Input type="password" placeholder="请再次输入您的密码" {...getFieldDecorator('r_confirmPassword')}/>
                                </FormItem>
                                <Button type="primary" htmlType="submit">注册</Button>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
		);
	};
}
export default MobileHeader = Form.create({})(MobileHeader);
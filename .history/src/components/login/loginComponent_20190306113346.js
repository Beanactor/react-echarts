import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import Qs from 'qs';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './login.css';
class loginComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			pasword: '',
			open: false,
			formTooltip: '',
			icon: '',
			type: 0
		};
	}
	toggle = () => {
		if (this.state.type === 0) {
			this.setState({
				type: 1
			});
		} else {
			this.setState({
				type: 0
			});
		}
	}
	handleTooltipClose = () => {
		this.setState({
			open: false
		});
	};

	handleTooltipOpen = () => {
		this.setState({
			open: true
		});
		setTimeout(() => {
			this.handleTooltipClose();
		}, 1500)
	};
	getTitle = () => {
		axios.get('http://ztc.hntv9hr.com' + '/open/bigdata/getTitle', {
			params: {
				abbreviation: localStorage.abbreviation
			}
		}).then((res) => {
			this.setState({
				title: res.data.content.data.title,
				areaId: res.data.content.data.areaId
			})
			localStorage.title = this.state.title;
			localStorage.areaId = this.state.areaId;
			localStorage.socketUrl = 'wss://m.dgztc.com/districtwebsocket' + '/' + localStorage.areaId;
		}).catch((err) => {
			console.log(err);
		})
	}
	handleChange = (event) => {
		this.setState({
			pasword: event.target.value
		});
	}
	handleLogin = (a) => {
		console.log(a)
		this.setState({
			type: this.state.type + 1
		})
		console.log(this.state.type)
		var {
			pasword
		} = this.state;
		if (pasword === '') {
			this.setState({
				formTooltip: '请输入密码'
			})
			this.handleTooltipOpen();
			return;
		}
		axios({
			method: 'post',
			url: 'http://ztc.hntv9hr.com' + '/open/bigdata/login',
			data: Qs.stringify({
				password: pasword,
				areaId: this.state.areaId
			})
		}).then((res) => {
			if (res.data.state === 1) {
				localStorage.mapvtoken = res.data.content.data.token;
				this.setState({
					formTooltip: '登录成功'
				})
				this.handleTooltipOpen();
				setTimeout(() => {
					this.props.history.push({ pathname: '/app/' + localStorage.abbreviation, search: '?a=123' })
				}, 1500);
			} else {
				this.setState({
					formTooltip: res.data.message
				})
				this.handleTooltipOpen();
			}
		}).catch(function (error) {
			console.log(error)
		})
	}
	render() {
		var indexiconstyle = this.props.match.params.id === 'xax' ? { color: '#f0f' } : { color: '#0f0' }
		return (
			<div id="login">
				<div className="title">
					<p>{this.state.title}</p>
					<p onClick={this.toggle}>第一就业大数据平台</p>
				</div>
				<ReactCSSTransitionGroup
					transitionName="test"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={0}
				>
					{this.state.type === 0 ? <div style={{ color: '#f00',position: "absolute" }} key={1}>11111111111111</div> : <div style={{ color: '#0f0',position: "absolute" }}key={2}>2222222222222222</div>}
				</ReactCSSTransitionGroup>
				<div className="login">
					<span className="iconfont icon_index" style={indexiconstyle}>&#xe66f;</span>
					<input type="password" id="psd" maxLength="30" placeholder="密码长度6-30位" value={this.state.password} onChange={this.handleChange} />
					<Tooltip
						onClose={this.handleTooltipClose}
						open={this.state.open}
						disableFocusListener
						disableHoverListener
						disableTouchListener
						title={this.state.formTooltip}
						placement='top'
					>
						<button className="loginbtn" onClick={()=>{this.handleLogin(123)}}>登&nbsp;录</button>
					</Tooltip>
				</div>
				<img src={require('../../assets/imgs/login_bg.jpg')} alt='' />
			</div>
		)
	}
	componentDidMount() {
		// 页面渲染之后
		console.log(ReactDOM);
		console.log(ReactDOM.findDOMNode(this));
		console.log(this.props)
		localStorage.abbreviation = this.props.match.params.id;
		this.getTitle();
	}

}

export default withRouter(loginComponent);
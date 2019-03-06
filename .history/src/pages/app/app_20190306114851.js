import React, {
	Component
} from 'react';
import { BrowserRouter as Router, Route, Link, withRouter, Prompt } from 'react-router-dom';

import loginComponent from '../../components/login/loginComponent';
import registerComponent from '../../components/registerComponent';

import './app.css';
// ajax
import axios from 'axios';

//import geoJson from '../utils/geoJson'; // 为什么这样不行
import geoJson from '../../config/geoJson';
//  导入echarts 图标库
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react';
// material-ui Button
import Button from '@material-ui/core/Button';

class App extends Component {
	constructor(props) {

		super(props);

		this.state = {
			alert: true,
			userSexRatio: [],
			userChannel: [],
			dataFactoryList: [],
			geoCoordMapFactory: {},
			convertData: null,
			columndata: {},
			linedata: {}

		};

	}
	handleClick = () => {
		console.log(this)
		console.log("handleClick");
		// this.props.history.push('/loginComponent')
	}
	componentDidMount() {
		console.log(this.props.location)
		let params = new URLSearchParams(this.props.location.search);
		console.log(params.get("a"));
		// 工作站数量变化曲线
		axios({
			method: 'get',
			url: 'http://ztc.hntv9hr.com/open/bigdata/resumeChangeCurve',
			params: {
				areaId: localStorage.areaId,
				days: 10,
				token: window.localStorage.mapvtoken
			},
		}).then(function (res) {
			if (res.data.state === -1) {
				setTimeout(() => {
					this.props.history.push('/login/' + localStorage.abbreviation)
				}, 1500);
			}
			var data = res.data.content.rows;
			console.log('---------------')
			console.log(data)
			var linevalue = [];
			var linedaily = [];
			for (var i = 0; i < data.length; i++) {
				linevalue.push(data[i].count);
				linedaily.push(data[i].daily);
			}
			this.state.linedata.linevalue = linevalue;
			this.state.linedata.linedaily = linedaily;
		}.bind(this))
			.catch(function (error) {
				console.log(error);
			});
		// 工作站排行榜
		axios({
			method: 'get',
			url: 'http://ztc.hntv9hr.com/open/bigdata/partnerRankingOfArea',
			params: {
				topNum: 8,
				areaId: localStorage.areaId,
				token: localStorage.mapvtoken,
				type: 1
			},
		}).then(function (res) {
			/*if(res.data.state === -1) {
				this.$router.push({
					path: '/login' + '/' + this.$route.params.areaId
				});
			}*/
			var data = res.data.content.rows;
			var columnYtext = [];
			var columnCount = [];
			for (var i = 0; i < data.length; i++) {
				columnYtext.push(data[i].name);
				columnCount.push(data[i].value);
			}
			this.state.columndata.columnYtext = columnYtext.reverse();
			this.state.columndata.columnCount = columnCount.reverse();
		}.bind(this))
			.catch(function (error) {
				console.log(error);
			});
		axios({
			method: 'get',
			url: 'http://ztc.hntv9hr.com/open/bigdata/partnerRankingOfArea',
			params: {
				topNum: 10,
				areaId: localStorage.areaId,
				token: localStorage.mapvtoken,
				type: 1
			}
		})
			.then(res => {
				let userSexRatio = res.data.content.rows.map(function (item) {
					return {
						name: item.name,
						value: item.value
					}
				});

				this.setState({
					userSexRatio
				})
				console.log(this.state.userSexRatio);
			});
		axios.get("http://ztc.hntv9hr.com/open/bigdata/resumeRankingOfArea", {
			params: {
				topNum: 10,
				areaId: localStorage.areaId,
				token: localStorage.mapvtoken,
				type: 1
			}
		})
			.then(res => {
				let userChannel = res.data.content.rows.map(function (item) {
					return {
						name: item.name,
						value: item.value
					}
				});

				this.setState({
					userChannel
				})

			}).catch((err) => {
				console.log(err)
			});
		axios.get("http://ztc.hntv9hr.com/open/statistics/usermap/resumeRankingOfFactory")

			.then(res => {
				let geoCoordMapFactory = [];
				res.data.content.rows.map(function (item) {
					geoCoordMapFactory[item.factory_name] = [item.longitude, item.latitude];
				});
				this.setState({
					geoCoordMapFactory
				});
				console.log(res)
				//				let dataFactoryList = res.data.content.rows
				let dataFactoryList = [{
					"factory_name": "郑州富士康",
					"count": 362
				}, {
					"factory_name": "昆山世硕",
					"count": 313
				}].map(function (item) {

					return {
						name: item.factory_name,
						value: item.count
					}

				});
				this.setState({
					dataFactoryList: dataFactoryList
				})

				console.log(this.state.dataFactoryList);
				console.log(this.state.geoCoordMapFactory);
				//				return;
				console.log(echarts);
				console.log(geoJson);
				console.log('--------------');
				echarts.registerMap('zhongguo', geoJson);
				var geoCoordMap = this.state.geoCoordMapFactory;
				var data = this.state.dataFactoryList;
				var max = 100000,
					min = 0;
				var maxSize4Pin = 100,
					minSize4Pin = 50;

				var convertData = function (data) {
					var res = [];
					for (var i = 0; i < data.length; i++) {
						var geoCoord = geoCoordMap[data[i].name];
						if (geoCoord) {
							res.push({
								name: data[i].name,
								value: geoCoord.concat(data[i].value)
							});
						}
					}
					return res;
				};
				//				console.log(convertData);
				this.setState({
					convertData
				}, function () {
					//					console.log(convertData)
				});
				//				console.log(this.state.convertData)
			});
	}
	render() {
		return (
			<div className="App">
				<header className="header" onClick={this.handleClick}>
					<Prompt
						when={this.state.alert}
						message={location => {
							const isApp = location.pathname.startsWith('/login');
							return isApp ? `你确定要跳转到${location.pathname}吗？` : true;
						}}
					/>
					<div className="leftUlBox">
						<ul className="leftUl">
							<li>
								<p>乡级工作站</p>
								<p>18</p>
							</li>
							<li>
								<p>村级工作站</p>
								<p>285</p>
							</li>
						</ul>
					</div>
					<div className="log">
						<p>新安县人力资源和社会保障局</p>
						<p>第一就业大数据平台</p>
					</div>
					<div className="rightUlBox">
						<ul className="rightUl">
							<li>
								<p>工作站总数</p>
								<p>303</p>
							</li>
							<li>
								<p>报名数量</p>
								<p className="showAdd">1412<span className="isShowAdd1">+1</span></p>
							</li>
						</ul>
					</div>
				</header>
				<div className="main" >
					<div className="leftWrap">
						<div className="user-gender" >
							<ReactEcharts
								option={{
									backgroundColor: 'rgba(0,0,0,0)',
									title: {
										text: '各乡镇工作站占比',
										left: 'center',
										top: 0,
										textStyle: {
											color: '#fff',
											fontSize: 20
										}
									},
									tooltip: {
										trigger: 'item',
										formatter: "{a} <br/>{b} : {c} ({d}%)"
									},
									series: [{
										name: '工作站',
										type: 'pie',
										radius: '55%',
										center: ['50%', '50%'],
										data: this.state.userSexRatio,
										roseType: 'radius',
										label: {
											normal: {
												textStyle: {
													color: '#fff'
												}
											}
										},
										labelLine: {
											normal: {
												lineStyle: {
													color: '#fff'
												},
												smooth: 0.2,
												length: 10,
												length2: 20
											}
										},
										itemStyle: {
										},
										color: ['#0f6', '#09f'],
										animationType: 'scale',
										animationEasing: 'elasticOut',
										animationDelay: function (idx) {
											return Math.random() * 200;
										}
									}]
								}}
								style={{ width: '100%', height: '100%' }} />
						</div>
						<div className="user-age">
							<ReactEcharts
								option={{
									title: {
										text: '各乡镇简历数量占比',
										left: 'center',
										top: 0,
										textStyle: {
											color: '#fff',
											fontSize: 20
										}
									},
									tooltip: {
										trigger: 'item',
										formatter: "{a} <br/>{b} : {c} ({d}%)"
									},
									legend: {
										orient: 'vertical',
										left: 'left',
									},
									series: [
										{
											name: '简历',
											type: 'pie',
											radius: '55%',
											center: ['50%', '60%'],
											data: this.state.userChannel,
											itemStyle: {
												emphasis: {
													shadowBlur: 10,
													shadowOffsetX: 0,
													shadowColor: 'rgba(0, 0, 0, 0.5)'
												}
											}
										}
									]
								}}
								style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
					<div className="rightWrap">
						<div className="FactoryList">
							<ReactEcharts
								option={{
									title: {
										text: '各乡镇区工作站总数量排行',
										left: 'center',
										textStyle: {
											fontSize: 16,
											color: "#fff",
										},
										subtextStyle: {
											fontSize: 13,
											color: "#fff"
										}
									},

									tooltip: {
										trigger: 'axis',
										axisPointer: {
											type: 'shadow'
										}
									},
									grid: {
										left: '3%',
										right: '4%',
										bottom: '3%',
										containLabel: true
									},
									xAxis: {
										type: 'value',
										boundaryGap: [0, 0.01],
										minInterval: 1,
										splitLine: {
											show: false
										},
										axisLine: {
											lineStyle: {
												color: '#fff'
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												type: 'dotted',
												color: '#aaa'
											}
										}
									},
									yAxis: {
										type: 'category',
										data: this.state.columndata.columnYtext,
										minInterval: 0,
										splitLine: {
											show: false
										},
										axisLine: {
											lineStyle: {
												color: '#fff'
											}
										},
										splitLine: {
											lineStyle: {
												color: '#fff'
											}
										}
									},
									itemStyle: {
										normal: {
											color: '#61bad5'
										},
										emphasis: {
											color: '#fff'
										}
									},
									series: [{
										type: 'bar',
										data: this.state.columndata.columnCount,
										barWidth: 20,
										barGap: 10,
										barCategoryGap: 1,
									}]
								}}
								style={{ height: '400px', width: '100%' }}
								opts={{ renderer: 'svg' }}
								className='react_for_echarts' />
						</div>
						<div className="resumeNum">
							<ReactEcharts
								option={{
									title: {
										text: '每日新增简历数量变化趋势',
										left: 'center',
										textStyle: {
											color: '#fff',
											fontSize: 16,
										}
									},
									legend: {
										type: 'plain',
										left: 'center',
										top: 'bottom',
										data: [{
											name: '简历',
											textStyle: {
												color: '#fff'
											}
										}]
									},
									tooltip: {
										trigger: 'axis'
									},
									toolbox: {
										show: false,
										feature: {
											dataZoom: {
												yAxisIndex: 'none'
											},
											dataView: {
												readOnly: false
											},
											magicType: {
												type: ['line', 'bar']
											},
											restore: {},
											saveAsImage: {}
										}
									},
									xAxis: {
										type: 'category',
										boundaryGap: false,
										data: this.state.linedata.linedaily,
										axisLine: {
											show: true,
											lineStyle: {
												color: "#fff",
												width: '2'
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												type: 'dotted',
												color: '#aaa'
											}
										},
									},
									yAxis: {
										type: 'value',
										axisLabel: {
											formatter: '{value}'
										},
										axisLine: {
											show: true,
											lineStyle: {
												color: "#fff",
												width: '2'
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												type: 'dotted',
												color: '#aaa'
											}
										},
									},
									itemStyle: {
										normal: {
											color: '#61bad5'
										}
									},
									lineStyle: {
										normal: {
											color: '#75baf5'
										}
									},
									series: [{
										name: '简历',
										type: 'line',
										data: this.state.linedata.linevalue,
										markPoint: {
											data: [{
												type: 'max',
												name: '最大值'
											},
											{
												type: 'min',
												name: '最小值'
											}
											]
										},
										markLine: {
											data: [{
												type: 'average',
												name: '平均值'
											}]
										},
									}]
								}}
								style={{ height: '350px', width: '100%' }}
								className='react_for_echarts' />

						</div>
					</div>
				</div>


			</div >
		);
	}
}

export default App;
/*<h1>厂区数据列表 </h1>
				<ul>
					{this.state.dataFactoryList.map(item => {
						if (item.value > 20) {
							return (<li key={item.value} ><span>{item.name}</span><span>{item.value}</span></li>)
						}
					})}

				</ul>*/
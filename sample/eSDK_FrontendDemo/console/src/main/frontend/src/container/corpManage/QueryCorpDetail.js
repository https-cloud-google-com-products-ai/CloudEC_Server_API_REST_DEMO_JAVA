/**
 * Copyright 2019 Huawei Technologies Co., Ltd. All rights reserved.
 */
import React from 'react'
import { Input, Button, Tabs, message} from 'antd'
import 'antd/dist/antd.css'
import { get } from '@/utils/request'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
require ('@/component/ui/codemirror.css')
require ('@/component/ui/jsonColor.css')

const TabPane = Tabs.TabPane;
let resBody = '';
let displayValue = 'none';
let statusCodeAndresbody = '';
let URL = "/rest/usg/datacenter/v1/sp/corp/{id}"

let date;
let connection;
let contentType;
let contentLength;
let server;
// let proxyId;
//查询企业详情API接口调用
export default class QueryCorpDetail extends React.Component {
    constructor () {
        super();
        this.state = {
            display: displayValue,
            resBody:resBody,    
            statusCode:statusCodeAndresbody,
            url: URL,
        }
    }

    handleOnClick = () => {
        let headers = {'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': sessionStorage.getItem('access_token')
                    };

        const {url} = this.state;
        
        if(url ==='' || url === undefined){
            message.info("url不能为空!");
            return;
        }

        get(url, headers).then(
            (res) => {
                
                if(res.success) {
                    displayValue = 'block';
                    statusCodeAndresbody = 'Body [' + res.data.httpCode +']';
            
                    this.setState({
                        display: displayValue,
                        statusCode:statusCodeAndresbody
                    });

                    //获取响应后的结果
                    date=res.data.headers['Date'];
                    connection=res.data.headers['Connection'];
                    contentType=res.data.headers['Content-Type'];
                    contentLength=res.data.headers['Content-Length'];
                    server=res.data.headers['Server'];
                    // proxyId=res.data.headers['http_proxy_id'];

                    resBody = JSON.stringify(JSON.parse(res.data.entity), null, 4);
                    this.setState(
                        {
                            resBody:resBody,
                        }
                    );  

                }else{
                    message.error(res.msg);
                }  
        })
    }

    render() {
        const options={
            styleActiveLine: true,
            lineNumbers: true,                     //显示行号
            lineWrapping: true,                    // 自动换行  
            mode: 'application/json', 
            theme: 'jsonColor',
        }
        let tempToken = sessionStorage.getItem('access_token');
        if(tempToken){
            tempToken = tempToken.split('|')[0];
        }
        return (
            <div style={{marginTop: '50px',marginLeft: '10%',width:'100%'}}>
                <div style={{width:'95%'}}>
                    <div style={{float:'left',width:'10%'}}>
                        <Button type="primary" icon="caret-right" onClick={this.handleOnClick}>Send</Button>
                    </div>
                    <div style={{float:'left',marginLeft: '2%',width:'15%'}}>
                        <Input placeholder="GET" readOnly/>
                    </div>
                    <div style={{float:'left',marginLeft: '20px',width:'60%'}}>
                        <Input addonBefore="URL" value={this.state.url} onChange={({target:{value}})=>{URL=value;this.setState({url:value})}}/>
                    </div>
                </div>
                
                <div style={{clear:'both'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Params" key="3" disabled>
                        </TabPane>
                        <TabPane tab="Headers" key="1"> 
                            <div style={{width:'100%'}}>
                                <ul>
                                    <li>
                                        <Input style={{width:'20%'}} readOnly value="Content-Type"/> : <Input style={{width:'60%'}} readOnly value="application/json"/> 
                                    </li>    
                                    <li><Input style={{width:'20%'}} readOnly value="Authorization"/> : <Input style={{width:'60%'}} readOnly value={tempToken}/></li>
                                </ul>
                            </div>
                        </TabPane>
                        <TabPane tab="Body" key="2" disabled>
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{display: this.state.display}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={this.state.statusCode} key="1">
                            <div>
                                <CodeMirror rows={6} value={this.state.resBody} options={options}></CodeMirror>
                            </div>
                        </TabPane>

                        <TabPane tab="Headers" key="2">
                            <div>
                                <ul>
                                <div style={{float:'left',height:'40px',width:'100%'}}><li><Input style={{width:'30%'}} readOnly value="Connection"/> : <Input style={{width:'60%'}} readOnly value={connection} /></li></div>
                                <div style={{float:'left',height:'40px',width:'100%'}}><li><Input style={{width:'30%'}} readOnly value="Content-Type"/> : <Input style={{width:'60%'}}  readOnly value={contentType} /></li></div>
                                <div style={{float:'left',height:'40px',width:'100%'}}><li><Input style={{width:'30%'}} readOnly value="Date"/> : <Input style={{width:'60%'}} readOnly value={date}/></li></div>
                                <div style={{float:'left',height:'40px',width:'100%'}}><li><Input style={{width:'30%'}} readOnly value="Server"/> : <Input style={{width:'60%'}}  readOnly value={server} /></li></div>
                                <div style={{float:'left',height:'40px',width:'100%'}}><li><Input style={{width:'30%'}} readOnly value="Content-Length"/> : <Input style={{width:'60%'}} readOnly value={contentLength}/></li></div>
                                {/* <div style={{float:'left',height:'40px',width:'100%'}}><li><Input style={{width:'30%'}} readOnly value="http_proxy_id"/> : <Input style={{width:'60%'}}  readOnly value={proxyId} /></li></div> */}
                                </ul>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {Button, Card, Descriptions, Form, List, message, Input, Spin, Divider} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  deleteInterfaceInfoUsingPost, getInterfaceInfoVoByIdUsingGet, invokeInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingPost
} from "@/services/API-platform/interfaceInfoController";
import {useParams} from "@@/exports";
import {FormProps} from "antd/lib";


/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams()
  const loadData = async () => {
    if(!params.id){
      message.error('参数不存在')
      return;
    }
    setLoading(true);
   try{
     const res = await getInterfaceInfoVoByIdUsingGet({
       id: Number(params.id)
     })
     setData(res.data)
   }catch (error) {
     message.error('加载失败.'+error.message);
   }
   setLoading(false);

  }
  useEffect(() => {
    loadData()
  }, [])

  const onFinish = async (values) => {
    setInvokeLoading(true);
    if(!params.id){
      message.error('参数不存在')
      return;
    }
    try{
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values
      })
      setInvokeRes(res.data)
      message.success('请求成功')
    }catch (error) {
      message.error('请求失败.'+error.message);
    }
    setInvokeLoading(false)
  };
  return (
    <PageContainer title="查看接口文档" >
      <Card>
        {data ? (
            <Descriptions title={data.name} column={1}>
              <Descriptions.Item label="接口状态">{data.status ? '正常' : '关闭'}</Descriptions.Item>
              <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
              <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
              <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
              <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
              <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
              <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
            </Descriptions>
          ) : (
            <>接口不存在</>
          )}
      </Card>
      <Divider/>
      <Card title="在线测试">
        <Form
          name="invoke"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="请求参数"
            name="userRequestParams"
          >
            <Input.TextArea/>
          </Form.Item>

          <Form.Item wrapperCol={{span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="调用结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;

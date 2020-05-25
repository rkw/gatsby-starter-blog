import React from "react"

import Amplify, { a } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import awsconfig from '../aws-exports';

import { List, Typography } from 'antd';
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';

Amplify.configure(awsconfig);

import { listArticles } from '../graphql/queries';
import { createArticle, deleteArticle } from '../graphql/mutations';

class TestPage extends React.Component {
  state = {
    articles: []
  }

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listArticles))
    this.setState({ articles: result.data.listArticles.items.sort((a,b) => {return a.id - b.id}) })
    console.log(this.state.articles)
  }

  formRef = React.createRef()
  onSubmit = async values => {
    await API.graphql(graphqlOperation(createArticle, {input: values}))
    let articles = this.state.articles
    articles.push(values)
    this.setState({articles: articles})
    this.formRef.current.resetFields()
    console.log(articles)
  }

  onDelete = async deleteId => {
    await API.graphql(graphqlOperation(deleteArticle, {input: {id: deleteId}}))
    let articles = this.state.articles.filter(obj => obj.id != deleteId);
    this.setState({articles: articles})
    console.log(articles)
  }

  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    }

    return (
      <List
        header={<h2>Articles</h2>}
        bordered
        dataSource={this.state.articles}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>{item.id}</Typography.Text> {item.name},{" "}
            {item.content}
            <span style={{float: 'right', cursor: 'pointer'}}
              onClick={e => {
                this.onDelete(item.id)
              }}
            >
              Delete
            </span>
          </List.Item>
        )}
        footer={
          <Form
            ref={this.formRef}
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onSubmit}
          >
            <Form.Item
              label="Article ID"
              name="id"
              rules={[{ required: true, message: "Please input an ID!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input a name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Slug"
              name="slug"
              rules={[{ required: true, message: "Please input a slug!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[
                { required: true, message: "Please input some content!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Add Article
              </Button>
            </Form.Item>
          </Form>
        }
      />
    )
  }
}

export default TestPage
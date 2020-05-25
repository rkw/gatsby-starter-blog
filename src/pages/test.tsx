import React from "react"

import Amplify from 'aws-amplify';
import gql from 'graphql-tag';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY, // or type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey,
  }
});

import { listArticles } from '../graphql/queries';

class TestPage extends React.Component {
  state = {
    articles: []
  }

  componentDidMount = async () => {
    client.query({
      query: gql(listArticles)
    }).then(({ data: { listArticles } }) => {
      this.setState({ articles: listArticles.items })
    });
  }

  render() {

    return (
      <main>
        <h1>Articles</h1>
        <ul>
          {this.state.articles.map((item) => {
            return <li key={item.id}>{item.name}, {item.content}</li>
          })}
        </ul>
      </main>
    )
  }
}

export default TestPage
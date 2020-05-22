import React from "react"

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

// import { createArticle } from '../graphql/mutations';
import { listArticles } from '../graphql/queries';

// const article = { id: "3", name: "First Article", slug: "first-article", content: "check it!" };

// API.graphql(graphqlOperation(createArticle, {input: article}))


class TestPage extends React.Component {
  state = {
    articles: []
  }

  componentDidMount = async () => {
    const resp = await API.graphql(graphqlOperation(listArticles))
    this.setState({ articles: resp.data.listArticles.items })
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
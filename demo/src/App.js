import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Upload,
  message,
  Button,
  Icon,
  List,
  Card
} from 'antd';
import _ from 'lodash';

const { Header, Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverUrl: `/image/upload`,
      images: []
    };
  }

  onChange = ({ file = {} }) => {
    if (file.status === 'done') {
      const { response = {} } = file;
      if (!_.isArray(response.images) || !response.images[0]) {
        return message.error(`Cannot get image ${file.name} from server`);
      }

      const { name, url = {} } = response.images[0];
      const source = _.map(url, (src, size) => ({
        title: size,
        src
      }));

      this.setState({
        images: [...this.state.images, { name, source }]
      });

      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
  };

  render() {
    return (
      <Layout className="layout">
        <Header>
          <img
            className="logo"
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            style={{
              width: 31,
              height: 31,
              margin: '16px 24px 16px 0',
              float: 'left'
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['upload']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="upload">Upload</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Upload</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              background: '#fff',
              padding: 24,
              minHeight: 480,
              textAlign: 'center'
            }}
          >
            <Upload
              name="images"
              multiple
              action={this.state.serverUrl}
              onChange={this.onChange}
            >
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>

            {this.state.images.map(({ name, source }) => (
              <List
                key={name}
                header={name}
                grid={{ column: 6 }}
                dataSource={source}
                renderItem={item => (
                  <List.Item>
                    <Card title={item.title}>
                      <a
                        href={`//${item.src}`}
                        title={item.title}
                        target="_blank"
                      >
                        <img
                          style={{ width: 144, height: 108 }}
                          src={`//${item.src}`}
                          alt={item.title}
                        />
                      </a>
                    </Card>
                  </List.Item>
                )}
              />
            ))}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          PicoSix ©2016 Created by PicoSix Team
        </Footer>
      </Layout>
    );
  }
}

export default App;

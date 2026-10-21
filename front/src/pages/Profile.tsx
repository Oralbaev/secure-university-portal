import React from "react"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { Descriptions, Layout, Button, theme, Typography } from "antd"
import type { DescriptionsProps } from "antd"
const { Header, Content } = Layout
const { Title } = Typography

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "UserName",
    children: "Zhou Maomao",
  },
  {
    key: "2",
    label: "Telephone",
    children: "1810000000",
  },
  {
    key: "3",
    label: "Live",
    children: "Hangzhou, Zhejiang",
  },
  {
    key: "4",
    label: "Remark",
    children: "empty",
  },
  {
    key: "5",
    label: "Address",
    children: "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
  },
  { key: "6", label: "Course", children: "Computer Science" },
  { key: "7", label: "Year", children: "1st Year" },
]

const App: React.FC = () => {
  const navigate = useNavigate()
  const handleNavigate = (page: string) => {
    navigate(page)
  }
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{
              fontSize: 24,
              width: 64,
              height: 64,
              position: "absolute",
              left: 16,
            }}
            onClick={() => handleNavigate("/dashboard")}
          />
          <Title level={3} style={{ margin: "0 auto" }}>
            UNINET
          </Title>
        </div>
      </Header>

      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Descriptions title="User Info" items={items} bordered column={1} />
      </Content>
    </Layout>
  )
}

export default App

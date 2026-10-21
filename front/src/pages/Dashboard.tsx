import React, { useState } from "react"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  UserOutlined,
  FormOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  FileOutlined,
} from "@ant-design/icons"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button, Layout, Menu, theme, Typography } from "antd"

import TimeTable from "./TimeTable"
import Attestation from "./Transcript"
import Form from "./Form"
import Inbox from "./Inbox"
import StudentFiles from "./StudentFiles"
import AttendanceMark from "./Attendance"

const { Header, Sider, Content } = Layout
const { Title } = Typography

const componentMap: Record<string, React.FC> = {
  "1": TimeTable,
  "2": Attestation,
  "3": Form,
  "4": AttendanceMark,
  "5": Inbox,
  "6": StudentFiles,
}

const App: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [collapsed, setCollapsed] = useState(false)
  const sectionParam = searchParams.get("section") ?? "1"
  const selectedKey = sectionParam in componentMap ? sectionParam : "1"
  const setSelectedKey = (key: string) => setSearchParams({ section: key })

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleNavigate = (page: string) => {
    navigate(page)
  }

  const SelectedComponent = componentMap[selectedKey]

  return (
    <Layout style={{ height: "100vh", width: "100vw" }} hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "#eee", position: "sticky" }}
      >
        <div style={{ textAlign: "center", padding: 16 }}>
          {collapsed ? (
            <Title level={3}>UNI</Title>
          ) : (
            <Title level={4}>UNINET Best Edu</Title>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ background: "#eee" }}
          items={[
            { key: "1", icon: <UserOutlined />, label: "Time Table" },
            { key: "2", icon: <SolutionOutlined />, label: "Transcript" },
            { key: "3", icon: <FormOutlined />, label: "Requests" },
            { key: "4", icon: <CheckCircleOutlined />, label: "Attendance mark" },
            { key: "5", icon: <InboxOutlined />, label: "Inbox" },
            { key: "6", icon: <FileOutlined />, label: "Student files" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: "flex" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 64, height: 64 }}
            />
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                marginLeft: "auto",
                alignSelf: "center",
                fontSize: 24,
                width: 64,
                height: 64,
              }}
              onClick={() => handleNavigate('/profile')}
            />
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          {SelectedComponent && <SelectedComponent />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App

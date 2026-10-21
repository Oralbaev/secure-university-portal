import React from "react"
import { Table, Tag } from "antd"
import type { TableProps } from "antd"

interface DataType {
  key: string
  course: string
  code: string
  credits: number
  grade: string
  status: string
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Course",
    dataIndex: "course",
    key: "course",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Credits",
    dataIndex: "credits",
    key: "credits",
  },
  {
    title: "Grade",
    dataIndex: "grade",
    key: "grade",
    render: (grade: string) => {
      const letter = grade.charAt(0)
      let color = "red"
      if (letter === "A" || letter === "B") color = "green"
      else if (letter === "C") color = "orange"
      return <Tag color={color}>{grade}</Tag>
    },
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status) => (
      <Tag color={status === "Passed" ? "green" : "red"}>{status}</Tag>
    ),
  },
]

const data: DataType[] = [
  {
    key: "1",
    course: "Calculus I",
    code: "MATH101",
    credits: 4,
    grade: "A",
    status: "Passed",
  },
  {
    key: "2",
    course: "Physics I",
    code: "PHYS101",
    credits: 4,
    grade: "B",
    status: "Passed",
  },
  {
    key: "3",
    course: "Programming",
    code: "CS101",
    credits: 3,
    grade: "A",
    status: "Passed",
  },
]

const App: React.FC = () => (
  <Table<DataType> columns={columns} dataSource={data} />
)

export default App

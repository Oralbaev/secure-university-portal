import { useEffect, useState } from "react"
import type { FC } from "react"
import { useNavigate } from "react-router-dom"
import {
  Alert,
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd"
import type { TableProps } from "antd"

type Course = {
  id: string
  code: string
  title: string
  credits: number
}

type Grade = {
  id: string
  course: Course | null
  semester: string
  score: number
  letterGrade: string
  gradePoints: number
  passed: boolean
}

type Summary = {
  totalCredits: number
  earnedCredits: number
  gpa: number | null
  courses: number
}

type GradesResponse = {
  status: string
  grades: Grade[]
  summary: Summary
  err?: string
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

const emptySummary: Summary = {
  totalCredits: 0,
  earnedCredits: 0,
  gpa: null,
  courses: 0,
}

const clearSession = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("authUser")
  sessionStorage.removeItem("authToken")
  sessionStorage.removeItem("authUser")
}

const gradeColor = (letter: string) => {
  if (letter.startsWith("A")) return "green"
  if (letter.startsWith("B")) return "blue"
  if (letter.startsWith("C")) return "orange"
  return "red"
}

const columns: TableProps<Grade>["columns"] = [
  {
    title: "Course",
    key: "course",
    render: (_, record) => record.course?.title ?? "Course unavailable",
  },
  {
    title: "Code",
    key: "code",
    render: (_, record) => record.course?.code ?? "—",
  },
  {
    title: "Credits",
    key: "credits",
    render: (_, record) => record.course?.credits ?? "—",
  },
  {
    title: "Semester",
    dataIndex: "semester",
    key: "semester",
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "Grade",
    dataIndex: "letterGrade",
    key: "letterGrade",
    render: (letter: string) => <Tag color={gradeColor(letter)}>{letter}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "passed",
    key: "passed",
    render: (passed: boolean) => (
      <Tag color={passed ? "green" : "red"}>
        {passed ? "Passed" : "Not passed"}
      </Tag>
    ),
  },
]

const Transcript: FC = () => {
  const navigate = useNavigate()
  const [grades, setGrades] = useState<Grade[]>([])
  const [summary, setSummary] = useState<Summary>(emptySummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadTranscript = async () => {
      const token =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      if (!token) {
        navigate("/", { replace: true })
        return
      }

      try {
        const response = await fetch(`${apiUrl}/grades/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 401) {
          clearSession()
          navigate("/", { replace: true })
          return
        }

        const result = (await response.json()) as GradesResponse
        if (!response.ok) {
          throw new Error(result.err || "Unable to load transcript")
        }

        if (cancelled) return
        setGrades(result.grades ?? [])
        setSummary(result.summary ?? emptySummary)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load transcript",
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadTranscript()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Transcript
      </Typography.Title>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 16 }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="GPA"
                  value={summary.gpa === null ? "N/A" : summary.gpa.toFixed(2)}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic title="Total credits" value={summary.totalCredits} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic title="Earned credits" value={summary.earnedCredits} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic title="Courses" value={summary.courses} />
              </Card>
            </Col>
          </Row>

          <Table<Grade>
            columns={columns}
            dataSource={grades}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: "No grades have been recorded yet." }}
          />
        </>
      )}
    </div>
  )
}

export default Transcript

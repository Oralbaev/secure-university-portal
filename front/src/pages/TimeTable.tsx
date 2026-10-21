import React from "react"
import { Col, Row, Layout, Card } from "antd"


const App: React.FC = () => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <Layout style={{ padding: '20px' }}>
      <Row gutter={8} wrap={false} style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        <Col flex="64px"></Col>
        {days.map(day => (
          <Col key={day} flex={1} style={{ textAlign: 'center' }}>
            {day}
          </Col>
        ))}
      </Row>
      {hours.map(hour => (
        <Row key={hour} gutter={8} wrap={false} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd' }}>
          <Col flex="64px" style={{ fontWeight: 'bold' }}>
            {hour}:00
          </Col>
          {days.map(day => (
            <Col key={`${day}-${hour}`} flex={1} style={{ padding: '10px', border: '1px solid #f0f0f0' }}>
              <Card size="small" style={{ height: '5vh' }}>
                {/* Placeholder for class/event */}
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </Layout>
  )
}

export default App

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap'

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_URL}/restaurants`)
                if (!response.ok) {
                    throw new Error('Error fetching restaurants')
                }
                const data = await response.json()
                setRestaurants(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Error: {error}</Alert>
            </Container>
        )
    }

    return (
        <Container className="mt-4">
            <h1 className="page-title text-center d-block mx-auto mb-5">Nuestros Restaurantes</h1>
            <Row>
                {restaurants.map((res) => (
                    <Col key={res.restauranteID} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="h-100 shadow-sm border-0 restaurant-card">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{res.restaurante}</Card.Title>
                                <Card.Text className="text-muted">
                                    Barrio: {res.barrio}
                                </Card.Text>
                                <Link to={`/restaurant/${res.restauranteID}`} className="btn btn-primary mt-auto">
                                    Ver Detalles
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default RestaurantList

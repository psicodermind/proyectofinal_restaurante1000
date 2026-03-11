import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Table, Spinner, Alert, Tabs, Tab, Badge } from 'react-bootstrap'

const RestaurantDetail = () => {
    const { id } = useParams()
    const [data, setData] = useState({
        restaurant: null,
        dishes: [],
        orders: [],
        customers: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                // Fetch everything in parallel
                const [resResp, dishesResp, ordersResp, customersResp] = await Promise.all([
                    fetch(`${API_URL}/restaurants`),
                    fetch(`${API_URL}/dishes`),
                    fetch(`${API_URL}/orders`),
                    fetch(`${API_URL}/customers`)
                ])

                if (!resResp.ok || !dishesResp.ok || !ordersResp.ok || !customersResp.ok) {
                    throw new Error('Error fetching data from server')
                }

                const [restaurants, allDishes, allOrders, allCustomers] = await Promise.all([
                    resResp.json(),
                    dishesResp.json(),
                    ordersResp.json(),
                    customersResp.json()
                ])

                const currentRestaurant = restaurants.find(r => r.restauranteID === parseInt(id))
                const filteredDishes = allDishes.filter(d => d.restauranteID === parseInt(id))
                const filteredOrders = allOrders.filter(o => o.restauranteID === parseInt(id))

                // Find customers for these orders
                const customerIds = new Set(filteredOrders.map(o => o.clienteID))
                const filteredCustomers = allCustomers.filter(c => customerIds.has(c.clienteID))

                setData({
                    restaurant: currentRestaurant,
                    dishes: filteredDishes,
                    orders: filteredOrders,
                    customers: filteredCustomers
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        )
    }

    if (error || !data.restaurant) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Error: {error || 'Restaurante no encontrado'}</Alert>
                <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
            </Container>
        )
    }

    return (
        <Container className="mt-4">
            <Link to="/" className="btn btn-outline-secondary mb-4">← Volver</Link>
            <div className="mb-5 text-center">
                <h1 className="page-title">{data.restaurant.restaurante}</h1>
                <div className="d-flex justify-content-center gap-2">
                    <Badge bg="info" className="fs-6 px-3 py-2">{data.restaurant.barrio}</Badge>
                    <Badge bg="secondary" className="fs-6 px-3 py-2">ID: {data.restaurant.restauranteID}</Badge>
                </div>
            </div>

            <Tabs defaultActiveKey="dishes" id="restaurant-tabs" className="mb-4">
                <Tab eventKey="dishes" title={`Platos (${data.dishes.length})`}>
                    <Table striped bordered hover responsive className="mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>Plato</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.dishes.map(dish => (
                                <tr key={dish.platoID}>
                                    <td>{dish.plato}</td>
                                    <td>{dish.descripcion || 'Sin descripción'}</td>
                                    <td>{dish.precio}€</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="orders" title={`Pedidos (${data.orders.length})`}>
                    <Table striped bordered hover responsive className="mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>ID Pedido</th>
                                <th>Fecha</th>
                                <th>ID Cliente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.orders.map(order => (
                                <tr key={order.pedidoID}>
                                    <td>{order.pedidoID}</td>
                                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                                    <td>{order.clienteID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="customers" title={`Clientes (${data.customers.length})`}>
                    <Table striped bordered hover responsive className="mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Población</th>
                                <th>Sexo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.customers.map(customer => (
                                <tr key={customer.clienteID}>
                                    <td>{customer.clienteID}</td>
                                    <td>{customer.nombre} {customer.apellido1} {customer.apellido2}</td>
                                    <td>{customer.poblacion}</td>
                                    <td>{customer.sexo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default RestaurantDetail

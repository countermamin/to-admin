import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [formData, setFormData] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://94.131.121.176:8000/get_bot_text'); // ЭТО ЗАПРОС К СЕРВЕРУ
                console.log(response.data.data)
                setFormData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    async function handleSubmit(pk, name, value) {
        try {
            const response = await axios.post(
                'http://94.131.121.176:8000/update_bot_text',
                { pk, name, value },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Data submitted successfully!');
            console.log('Response:', response.data);
            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
            }, 2000);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }

    function handleTextChange(pk, e) {
        const newData = formData.map(item => {
            if (item.pk === pk) {
                return { ...item, value: e.target.value };
            }
            return item;
        });
        setFormData(newData);
    }

    return (
        <div className="App">
            {successMessage && (
                <div className="success-message show">
                    Успешно сохранено
                </div>
            )}
            {formData.map((formInfo) => (
                <Card key={formInfo.pk} style={{ width: '18rem', margin: '2rem' }}>
                    <Card.Body>
                        <Card.Title>{formInfo.pk}</Card.Title>
                        <Card.Text>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>{formInfo.name}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formInfo.value}
                                        onChange={(e) => handleTextChange(formInfo.pk, e)}
                                    />
                                </Form.Group>
                                <Button
                                    type="button"
                                    onClick={() => handleSubmit(formInfo.pk, formInfo.name, formInfo.value)}
                                >
                                    Сохранить
                                </Button>
                            </Form>
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default App;

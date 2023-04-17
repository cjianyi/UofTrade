import React from "react";
import Badge from 'react-bootstrap/Badge'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import "./styles.css";

/* Component for the LNav bar page */
class ItemCard extends React.Component {
isAdminOrself = () => {
    return this.props.app.state.userType === 'admin' || this.props.app.state.user === this.props.item.owner
}
  render() {      
    const { item, removePost } = this.props
    return (
        <Card style={{ width: '25rem' }}>
            <Card.Img variant="top" src={item.item.image.image_url} />
            <Card.Body>
                <Card.Title>{item.item.title}</Card.Title>
                <Card.Text>
                   {item.item.description}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
            <ListGroupItem>
                <Badge pill bg="info">
                    {item.item.tag}
                </Badge>
            </ListGroupItem>
            <ListGroupItem>Price: ${item.item.price}</ListGroupItem>
            <ListGroupItem>
                <Link to={`./../ProductListing/${item.owner}/${item.item._id}`}>
                    <Button variant="outline-primary">Go to Product Page</Button>
                </Link>
                {this.isAdminOrself() && (<button type="button" className="btn btn-outline-danger" onClick={removePost}>Remove</button>)}
            </ListGroupItem>
            </ListGroup>
      </Card>
    );
  }
}

export default ItemCard;
import React from "react";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";


/* Component for the LNav bar page */
class CategoryForm extends React.Component {
  render() {
    return (
        <div className='category-form'>
            <Form.Control as="select" custom='true' onChange={e => {this.props.filterCategory(this.props.marketplace, e.target.value)}}>
                <option key={1} value='All Categories'>All Categories</option>
                <option key={2} value='Textbook'>Textbook</option>
                <option key={3} value='School Supplies'>School Supplies</option>
                <option key={4} value='Electronics'>Electronics</option>
                <option key={5} value='Clothing'>Clothing</option>
                <option key={6} value='Home'>Home</option>
                <option key={7} value='Others'>Others</option>
            </Form.Control>
        </div>
    );
  }
}

export default CategoryForm;
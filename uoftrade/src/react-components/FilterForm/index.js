import React from "react";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";


/* Component for the LNav bar page */
class FilterForm extends React.Component {
  render() {
    return (
        <div className='filter-form'>

            <Form.Control as="select" custom onChange={e => {this.props.filterSort(this.props.marketplace, e.target.value)}}>
                <option key={1} value={1}>Sort By</option>
                <option key={2} value={2}>Price Ascending</option>
                <option key={3} value={3}>Price Descending</option>
            </Form.Control>
        </div>
    );
  }
}

export default FilterForm;
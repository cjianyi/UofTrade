import React from "react";
import NavBar from '../NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";
import ItemCard from '../ItemCard'
import CategoryForm from "../CategoryForm";
import { uid } from "react-uid";
import {removePost} from '../../action/postings'
import {getAllItems, filterCategory} from '../../action/Marketplace'

/* Component for the LNav bar page */
class Marketplace extends React.Component {
  state = {
    items: [],
    allItems: []
  }

  componentDidMount() {
    getAllItems(this)
  }
  render() {
    return (
        <div>
            <NavBar></NavBar>
            <h2 id='title'>Marketplace</h2>
            <div className='categoryformdiv'>
              <CategoryForm marketplace={this} filterCategory={filterCategory}></CategoryForm>
            </div>
            <br/>
            <div id='items'>
              {this.state.items.map((i) => {
                return(<ItemCard app= {this.props.app} key={uid(i)} item={i} removePost={() => removePost(this, i, 'marketplace')}></ItemCard>)
              })}
            </div>
        </div>
        
    );
  }
}

export default Marketplace;
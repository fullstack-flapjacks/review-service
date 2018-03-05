import React, { Component } from 'react';
import Utilities from './Utilities.js';


const DropDownSelect = ({ value, name, onSelectOption }) => {
  var text = Utilities.dropdownText(name);

  if (name === value){
    return <div className={"dropdown-option " + name} onClick={onSelectOption}>
      <i className="radio-checked"></i>
      <span className="radio-text">{text}</span>
    </div>;
  } else {
    return <div className={"dropdown-option " + name} onClick={onSelectOption}>
      <i className="radio-unchecked"></i>
      <span className="radio-text">{text}</span>
    </div>;
  }
}

class SortDropdown extends Component {
  constructor(props){
    super(props);

    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(){
    this.setState({ open: !this.state.open });
  }

  render(){
    var text = Utilities.dropdownText(this.props.value);
    const value = this.props.value;
    const handleChange = this.props.handleChange;

    return <div className="dropdown">
      <div className="selected" onClick={this.handleToggle}>
        <div className="selected-dropdown-option">
          <span>{text}</span>
          <i className={(this.state.open) ? "up-arrow": "down-arrow"}></i>
        </div>
      </div>
      <div className="options-container">
        <div className={(this.state.open) ? "options": "options hide"}>
          {['newest', 'highest', 'lowest'].map((name) => {
            return <DropDownSelect key={name} 
              value={value} 
              name={name} 
              onSelectOption={handleChange(name)} /> 
          })}
        </div>
      </div>
    </div>;    
  }

}

const FilterCheckbox = ({ word, onCheck, checked }) => (
  <div className="filter" onClick={onCheck(word)}>
    <label className="filter-label">{word.charAt(0).toUpperCase() + word.slice(1)}</label>
    <i className={(checked) ? "checked-box" : "unchecked-box"}></i>
  </div>
);

const FilterCheckboxes = ({ words, onCheck, checks }) => (
  <div className="filters">
    {words.map((word, idx) => <FilterCheckbox key={idx} word={word} onCheck={onCheck} checked={checks[word]} />)}
  </div>
);

export { SortDropdown, FilterCheckbox, FilterCheckboxes };
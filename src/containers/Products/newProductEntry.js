import React, { PropTypes } from 'react';
import { Row, Col, Button } from 'reactstrap';
import styles from './styles.css';
import Uploader from './../../components/Uploader';
import TagSelector from './../../components/TagSelector';

export default class NewProductEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempValues: {},
      ImageId: null,
      ...this.props.product,
      isEditing: this.props.isEditing,
    };
    this.removeTag = this.removeTag.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.duplicateProduct = this.duplicateProduct.bind(this);
    this.selectCurrentRow = this.selectCurrentRow.bind(this);
    this.imageUploadedHandler = this.imageUploadedHandler.bind(this);
    this.imageRemovedHandler = this.imageRemovedHandler.bind(this);
    this.editItem = this.editItem.bind(this);
    this.resetLoader = this.resetLoader.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileAddedHandler = this.fileAddedHandler.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.onTagSaveHandler = this.onTagSaveHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.product,
      isEditing: nextProps.isEditing,
    });
  }
  onChange() {
    if (this.props.onChangeHandler) {
      this.props.onChangeHandler(this.props.index, this.state);
    }
  }

  onTagSaveHandler(tags) {
    this.setState({
      Tags: tags,
    }, this.onChange);
  }

  selectCurrentRow() {
    if (this.props.selectedRowHandler) {
      this.props.selectedRowHandler(this.props.index);
    }
  }

  duplicateProduct() {
    if (this.props.duplicateProductHandler) {
      this.props.duplicateProductHandler(this.props.index);
    }
  }

  removeProduct() {
    if (this.props.removeProductHandler) {
      this.props.removeProductHandler(this.props.index);
    }
  }

  removeTag(index) {
    console.log(this, index);
  }

  fileAddedHandler() {
    this.editItem();
  }

  imageUploadedHandler(file, response) {
    const responseObject = JSON.parse(response);
    this.setState({
      ...this.state,
      previewBase64: file.previewElement.firstElementChild.firstElementChild.currentSrc,
      ImageId: responseObject.id,
    }, this.onChange);
  }

  imageRemovedHandler() {
    this.setState({
      ...this.state,
      ImageId: null,
      previewBase64: null,
    }, this.onChange);
  }

  editItem() {
    this.setState({
      ...this.state,
      isEditing: true,
    }, this.onChange);
    if (this.props.editAnotherElementHandler) {
      this.props.editAnotherElementHandler(this.props.index);
    }
  }

  resetLoader() {
    this.setState({
      previewBase64: null,
      ImageId: null,
    }, this.onChange);
  }

  render() {
    if (this.state.isEditing) {
      return (
        <Row className={styles.rowEntrySelected} key={this.props.index}>
          <Col>
            {this.state.previewBase64 &&
              <div className={styles.avatarHolder}>
                <img
                  className={styles.avatarTable}
                  src={this.state.previewBase64}
                  alt="Missing file"
                />
                <Button onClick={this.resetLoader} className={styles.dzRemove} />
              </div>
            }
            {!this.state.previewBase64 &&
              <Uploader
                callBackFileUploaded={this.imageUploadedHandler}
                callBackFileRemoved={this.imageRemovedHandler}
                callBackFileAdded={this.fileAddedHandler}
                maxFiles={1}
              />
            }
          </Col>
          <Col>
            <span> Tags: </span>
            {this.state.Tags.map((tag, indexTag) => (
              <span
                key={indexTag}
                className={styles.tagLabel}
              >
                {tag.displayName}
              </span>
            ))}
            <TagSelector
              onTagSaveHandler={this.onTagSaveHandler}
              currentAddedTags={this.state.Tags}
            />
          </Col>
          <Col>
            <Button size="sm" onClick={this.duplicateProduct} color="primary"> Duplicate Item </Button>
            <Button size="sm" onClick={this.removeProduct} color="danger"> Delete Item </Button>
          </Col>
        </Row>
      );
    }
    return (
      <Row className={styles.rowEntry} key={this.props.index} onClick={this.editItem}>
        <Col>
          {this.state.previewBase64 &&
            <img
              className={styles.avatarTable}
              src={this.state.previewBase64}
              alt="Missing file"
            />
          }
          {!this.state.previewBase64 &&
            <Uploader
              callBackFileUploaded={this.imageUploadedHandler}
              callBackFileRemoved={this.imageRemovedHandler}
              callBackFileAdded={this.fileAddedHandler}
              maxFiles={1}
              sizes={[
                { width: 320, height: 480 },
                { width: 640, height: 1136 },
                { width: 1242, height: 2208 },
                { width: 2000, height: 3000 },
              ]}
            />
          }
        </Col>
        <Col>
          {this.state.Tags.map((tag, indexTag) => (
            <span
              key={indexTag}
              className={styles.tagLabel}
            >
              {tag.displayName}
            </span>
          ))}
        </Col>
        <Col>
          <Button size="sm" color="secondary" onClick={this.editItem} > Edit this Item </Button>
        </Col>
      </Row>
    );
  }
}

NewProductEntry.defaultProps = {
  isEditing: true,
};

NewProductEntry.propTypes = {
  index: PropTypes.number,
  isEditing: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  product: PropTypes.object,
  selectedRowHandler: PropTypes.func,
  duplicateProductHandler: PropTypes.func,
  editAnotherElementHandler: PropTypes.func,
  onChangeHandler: PropTypes.func,
  removeProductHandler: PropTypes.func,

};

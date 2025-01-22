import './index.css'
import {Link} from 'react-router-dom'

const SimilarProductItem = (props) => {
  console.log(props) // Log the entire props object to check if productDetails is passed correctly
  const { productDetails } = props

  // Check if productDetails is undefined or null
  if (!productDetails) {
    return null // Return nothing if productDetails is not available
  }

  const { id, title, brand, image_url, rating, price } = productDetails
  console.log(title)
  return (
    <li className="similar-product-item">
     <Link to={`/products/${id}`} className="link-item">
      <img
        src={image_url}
        className="similar-product-img"
        alt={`similar product ${title}`}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-products-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star"
          />
        </div>
      </div>

      </Link>
    </li>
  )
}

export default SimilarProductItem

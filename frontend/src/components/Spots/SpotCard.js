import React from "react";
import { Link } from "react-router-dom";
import "./SpotCard.css";

const SpotCard = ({ spot }) => {
  return (
    <div className="spot-card">
      <Link to={`/spots/${spot.id}`} className="spot-link">
        <img className="spot-image" alt={spot.name} src={spot.previewImage} />
        <div className="spot-info">
          <div className="location-rating-box">
            <div className="spot-location">
              {spot.city}, {spot.state}
            </div>
            <div className="spot-rating">
              <i className="fa fa-star filled"></i>
              {spot.avgRating > 0 ? spot.avgRating.toFixed(2) : "No reviews yet"}
            </div>
          </div>
          <div className="spot-price">
            <span className="price-amount">${spot.price}
            {" "}</span>per night
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SpotCard;

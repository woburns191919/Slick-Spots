import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkGetSpotDetails,
  thunkGetReviewsBySpotId,
} from "../../store/spots";
import { thunkCreateBooking } from "../../store/bookings";

import { Link, useHistory } from "react-router-dom";
import "./GetAllSpots.css";
import "./SpotShow.css";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../Reviews/ReviewForm";
import ConfirmDelete from "../Reviews/ConfirmDelete";
import { useState } from "react";
import BookingForm from "./BookingForm";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const spot = useSelector((state) => state.spots.singleSpot || {});
  const spotImages = spot.SpotImages || [];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const spotArr = useSelector((state) =>
    state.spots.singleSpot ? state.spots.singleSpot : []
  );

  const reviewsArr = useSelector((state) => state.spots.spot.Reviews);
  const loggedInUser = useSelector(
    (state) => state.session && state.session.user
  );
  console.log("logged in user", loggedInUser);
  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(thunkGetReviewsBySpotId(spotId));
  }, [dispatch]);

  if (!spotArr.SpotImages) return null;
  console.log("spot array*******", spotArr);

  let months = [
    "Placeholder",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleReserveClick = async () => {
    const bookingPayload = {
      spotId,
      userId: sessionUser.id,
      startDate,
      endDate,
    };

    try {
      const createdBooking = await dispatch(thunkCreateBooking(bookingPayload));
      if (createdBooking) {
        history.push("/bookings/manage");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="outer-wrapper">
      <div className="spot-name">{spot.name}</div>

      <div className="spot-photo-wrapper">
        <div className="content-wrapper">
          <div className="parent-flex">
            <div className="big-photo-container">
              {spotImages
                .filter((img) => img.preview)
                .map((img, i) => (
                  <img key={i} className="big-photo" src={img.url} alt="" />
                ))}
            </div>
            <div className="small-photo-container">
              {spotImages
                .filter((img) => !img.preview)
                .map((img, i) => (
                  <img key={i} src={img.url} alt="" />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="reservation-box">
        <div className="reservation-content">
          <div className="price-info">
            <b>${spotArr.price}</b> per night
          </div>

          <div className="booking-options">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Check-in"
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Check-out"
              required
            />
          </div>

          <button onClick={handleReserveClick} className="reserve-button">
            Reserve
          </button>
        </div>
      </div>

      <section className="lower-spot-show">
        <div className="description">
          <h2>
            Hosted by {spotArr.Owner.firstName} {"  "} {spotArr.Owner.lastName}
          </h2>
          <p className="description">{spotArr.description}</p>
        </div>
        <div className="price-star-review-wrapper">
          <div className="top-price-star-review-wrapper">
            <div className="night">
              <b>${spotArr.price}</b> night
            </div>
            <div className="stars">
              <i className="fa fa-star"></i>{" "}
              {spotArr.avgStarRating > 0
                ? spotArr.avgStarRating.toFixed(2)
                : ""}{" "}
              &middot;
            </div>
            <div className="reviews">
              {spotArr.numReviews == 1
                ? spotArr.numReviews + " " + "Review"
                : spotArr.numReviews > 0 && spotArr.numReviews !== 1
                ? spotArr.numReviews + " " + "Reviews"
                : "new"}
            </div>
          </div>
        </div>
      </section>

      <hr />

      <section className="reviews-lower">
        <div className="reviews-lower-stars-number">
          <i className="fa fa-star"></i>{" "}
          {spotArr.avgStarRating > 0 ? spotArr.avgStarRating.toFixed(2) : "new"}{" "}
          &middot;{" "}
          {spotArr.numReviews === 1 ? (
            spotArr.numReviews + " " + "Review"
          ) : spotArr.numReviews > 0 && spotArr.numReviews !== 1 ? (
            spotArr.numReviews + " " + "Reviews"
          ) : spotArr.numReviews === 0 ? (
            <p>Be the first to post a review!</p>
          ) : (
            "new"
          )}
        </div>
        {loggedInUser &&
          spotArr.Owner.id !== loggedInUser.id &&
          reviewsArr &&
          !reviewsArr.find((el) => el.userId === loggedInUser.id) && (
            <Link to="/reviews/current">
              <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<ReviewForm spotId={spotId} />}
              />
            </Link>
          )}

        <div className="reviews-lower-text">
          {reviewsArr &&
            reviewsArr
              .concat()
              .reverse()
              .map((reviewsObj, i) => (
                <div key={i}>
                  <h3>{reviewsObj.User.firstName}</h3>
                  <h4>
                    {months[parseInt(reviewsObj.createdAt.slice(5, 7))]},{" "}
                    {reviewsObj.createdAt.slice(0, 4)}
                  </h4>
                  <p>{reviewsObj.review}</p>
                  {loggedInUser && loggedInUser.id === reviewsObj.userId && (
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={
                        <ConfirmDelete
                          reviewId={reviewsObj.id}
                          spotId={spotId}
                        />
                      }
                    />
                  )}
                </div>
              ))}
        </div>
      </section>
    </main>
  );
};

export default SpotShow;

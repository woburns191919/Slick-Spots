import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkGetSpotDetails,
  thunkGetReviewsBySpotId,
} from "../../store/spots";
import { thunkCreateBooking } from "../../store/bookings";

import { Link, useHistory, NavLink } from "react-router-dom";
import "./GetAllSpots.css";
import "./SpotShow.css";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../Reviews/ReviewForm";
import ConfirmDelete from "../Reviews/ConfirmDelete";
import { useState } from "react";
import SpotDelete from "./SpotDelete";
import BookingForm from "./BookingForm";
import LoginFormModal from "../LoginFormModal";

const SpotShow = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const spot = useSelector((state) => state.spots.singleSpot || {});
  const spotImages = spot.SpotImages || [];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingDateError, setBookingDateError] = useState("");
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const spotArr = useSelector((state) =>
    state.spots.singleSpot ? state.spots.singleSpot : []
  );

  const reviewsArr = useSelector((state) => state.spots.spot.Reviews);
  const loggedInUser = useSelector(
    (state) => state.session && state.session.user
  );
  const bookingError = useSelector((state) => state.bookings.bookingError);

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(thunkGetReviewsBySpotId(spotId));
  }, [dispatch]);

  if (!spotArr.SpotImages) return null;

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

  const userPictures = {
    1: "/dfw.jpg",
    2: "/biggie.jpg",
    3: "/nas.jpg",
    4: "/joyce.jpg",
    5: "/alissa.jpg",
    6: "/wbheadshot.jpg",
    7: "/tommy.jpg",
  };

  const isOwner =
    sessionUser && spotArr.Owner && sessionUser.id === spotArr.Owner.id;

  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  };

  const renderStarRating = (stars) => {
    let starIcons = [];
    for (let i = 0; i < 5; i++) {
      starIcons.push(
        <i
          key={i}
          className={`fa fa-star ${i < stars ? "filled" : ""}`}
          aria-hidden="true"
        ></i>
      );
    }
    return <div className="review-stars">{starIcons}</div>;
  };

  const handleReserveClick = async () => {
    if (!startDate || !endDate) {
      setBookingDateError("You must choose both a start and end date.");
      return;
    }
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

  const renderErrorMessages = () => {
    if (bookingError && bookingError.errors) {
      return Object.keys(bookingError.errors).map((key, index) => (
        <div key={index} className="error-message">
          {bookingError.errors[key]}
        </div>
      ));
    } else if (bookingError) {
      return <div className="error-message">{bookingError.message}</div>;
    }
    return null;
  };



  return (
    <main className="spot-show-outer-wrapper">
      <div className="spot-name">{spot.name}</div>

      <div className="spot-photo-wrapper">
        <div className="content-and-reservation-wrapper">
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
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "245px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="spot-info-box">
        <div className="host-info">
          <div>
            <div className="host-name">
              Hosted by {spotArr.Owner.firstName} {spotArr.Owner.lastName}
            </div>
            <p className="host-bio">{spotArr.Owner.bio}</p>
          </div>
        </div>
        <p className="description">{spotArr.description}</p>
      </div>
      <div className="lower-info-wrapper">
        <div className="top-price-star-review-wrapper">
          <div className="stars">
            <i className="fa fa-star filled"></i>{" "}
            {spotArr.avgStarRating > 0 ? spotArr.avgStarRating.toFixed(2) : ""}{" "}
          </div>
          <div className="reviews">
            {spotArr.numReviews == 1
              ? spotArr.numReviews + " " + "Review"
              : spotArr.numReviews > 0 && spotArr.numReviews !== 1
              ? spotArr.numReviews + " " + "Reviews"
              : "No reviews yet"}
          </div>
        </div>

        {renderErrorMessages()}
        {!sessionUser && !isOwner ? (
          <div className="owner-management-box">
            <OpenModalButton
              buttonText="Log In to Reserve"
              modalComponent={<LoginFormModal />}
            />
          </div>
        ) : !isOwner && sessionUser ? (
          <div className="reservation-box">
            <div className="price-info">
              <b>${spotArr.price}</b> per night
            </div>

            <div className="booking-options">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setBookingDateError("");
                }}
                min={getTodayDate()}
                placeholder="Check-in"
                required
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setBookingDateError("");
                }}
                min={startDate || getTodayDate()}
                placeholder="Check-out"
                required
              />
            </div>

            <button onClick={handleReserveClick} className="reserve-button">
              Reserve
            </button>
            {bookingDateError && (
              <div className="error-message">{bookingDateError}</div>
            )}
          </div>
        ) : (
          <div className="owner-management-box">
            <NavLink to={`/spots/current`} className="manage-spot-button">
              Manage your spots
            </NavLink>
          </div>
        )}

        <div className="lower-spot-show">
          <div className="description"></div>
          <div className="price-star-review-wrapper"></div>
        </div>
      </div>

      <section className="reviews-lower">
        {loggedInUser &&
          spotArr.Owner.id !== loggedInUser.id &&
          reviewsArr &&
          !reviewsArr.find((el) => el.userId === loggedInUser.id) && (
            <Link to={`/spots/${spotId}`}>
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
                  <div className="pic-and-name">
                  <img
                    className="profile-pics"
                    src={userPictures[reviewsObj.User.id] || "/writer.jpg"}
                    alt={`User ${reviewsObj.User.firstName}`}
                  />

                  <h3>{reviewsObj.User.firstName}</h3>
                  </div>
                  <div className="star-and-date">
                  {renderStarRating(reviewsObj.stars)}
                  <h4>
                    {months[parseInt(reviewsObj.createdAt.slice(5, 7))]},{" "}
                    {reviewsObj.createdAt.slice(0, 4)}
                  </h4>
                  </div>
                  <p className="review-p">{reviewsObj.review}</p>
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

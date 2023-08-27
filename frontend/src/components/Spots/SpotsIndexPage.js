import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllSpots } from "../../store/spots";
import "./GetAllSpots.css";
import { Link } from 'react-router-dom';

const SpotsIndexPage = () => {
  const spots = Object.values(
    useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : []))
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkGetAllSpots());
  }, [dispatch]);

  return (
    <>
      <main className="outer-wrapper">
        <div className="photo-container">
          {spots.map((spotObj, i) => (
           
            <div key = {i} className="inner-container">
             <Link to={`/spots/${spotObj.id}`}>
               <img src={`${spotObj.previewImage}`} />
             </Link>

              <div className="info">
                <div className="left-info">
                  <div className="city-state">
                    {spotObj.city}, {"   "} {"   "}
                    {spotObj.state}
                  </div>
                  <div className="star-info">{spotObj.avgRating}</div>
                </div>

                <div className="right-info">${spotObj.price} night</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default SpotsIndexPage;

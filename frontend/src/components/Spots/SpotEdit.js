import { thunkPutEditSpot, thunkGetSpotDetails } from "../../store/spots";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./form.css";

const SpotEdit = () => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  if (!user) {
    alert("You must be logged in to edit a spot!");
    history.push("/");
  }

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId)).then((data) => {
      setCountry(data.country);
      setAddress(data.address);
      setCity(data.city);
      setState(data.state);
      setLat(data.lat);
      setLng(data.lng);
      setDescription(data.description);

      setPrice(data.price);
      setName(data.name);
    });
  }, [dispatch, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const updatedSpot = {
      spotId,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      price,
      name,
    };

    if (!updatedSpot.spotId) return null;
    try {
      const editedSpot = await dispatch(thunkPutEditSpot(updatedSpot, spotId));
      if (editedSpot.id) {
        history.push(`/spots/${editedSpot.id}`);
      } else {
        setErrors({ message: "Unable to update the spot. Please try again." });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ message: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <main className="outer-wrapper">
      <div className="form-wrapper">
        <form
          className="spot-form"
          // style={{ marginTop: "700px" }}
          onSubmit={handleSubmit}
        >
          <h3>Update your Spot</h3>
          <div className="form-top-info">
            <h4>Where's your spot located?</h4>
            <p>
              Guests will only get your exact address once they booked a
              reservation.
            </p>
          </div>
          <label htmlFor="Country">
            Country <br></br>
            <input
              placeholder="Country"
              className="most-boxes"
              type="text"
              required={true}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <div>
            <label>
              Street Address <br></br>
              <input
                placeholder="Address"
                className="most-boxes"
                type="text"
                required={true}
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></input>
            </label>
          </div>

          <div className="citystatebox">
            <label className="citybox">
              City <br></br>
              <input
                placeholder="City"
                required={true}
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>

            <div className="statebox">
              <label>
                State <br></br>
                <input
                  placeholder="STATE"
                  required={true}
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="latlngbox">
            <div className="latbox">
              <label>
                Latitude <br></br>
                <input
                  placeholder="Latitude"
                  required={true}
                  type="text"
                  name="latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </label>
            </div>
            <div className="lngbox">
              <label>
                Longitude <br></br>
                <input
                  placeholder="Longitude"
                  required={true}
                  type="text"
                  name="longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="textarea-description">
            <label>
              <h4>Describe your spot to guests</h4> <br></br>
              <p>
                Mention the best features of your space, any special amentities
                like fast wifi or parking, and what you love about the
                neighborhood.
              </p>
              <div className="textareadiv">
                <textarea
                  placeholder="Please write at least 30 characters"
                  required={true}
                  minLength="30"
                  type="textarea"
                  value={description}
                  name="description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
            </label>
          </div>

          <div className="titlebox">
            <label>
              <h4>Create a title for your spot</h4> <br></br>
              <p>
                Catch guests' attention with a spot title that highlights what
                makes your spot special.
              </p>
              <input
                placeholder="Name of your spot"
                className="most-boxes"
                required={true}
                type="text"
                value={name}
                name="title"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
          </div>
          <div className="basepricebox">
            <label>
              <h4>Set a base price for your spot </h4>
              <br></br>
              <p>
                Competitive pricing can help your listing stand out and rank
                higher in search results.
              </p>

              <input
                placeholder="Price per night (USD)"
                required={true}
                type="number"
                min="0"
                name="base price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              ></input>
            </label>
          </div>
          <hr></hr>
          {Object.values(errors).map((error, idx) => (
            <div key={idx} className="error-message">
              {error}
            </div>
          ))}
          <div className="button-div">
            <button type="submit">Update Your Spot</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SpotEdit;

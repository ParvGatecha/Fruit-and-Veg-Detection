import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Container,
  Grid,
} from "@mui/material";

const App = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setPrediction("");
    setError("");
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPrediction(response.data.prediction);
    } catch (err) {
      setError("Error predicting the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Fruits & Vegetables Recognition
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Upload an image to identify whether it’s a fruit or vegetable.
      </Typography>
      <Box
        sx={{
          border: "1px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <input
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="upload-button"
        />
        <label htmlFor="upload-button">
          <Button variant="outlined" component="span">
            Choose Image
          </Button>
        </label>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {file ? file.name : "No file chosen."}
        </Typography>
      </Box>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePredict}
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              "Predict"
            )}
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {error}
        </Alert>
      )}
      {prediction && (
        <Alert severity="success" style={{ marginTop: "20px" }}>
          Prediction: <strong>{prediction}</strong>
        </Alert>
      )}
    </Container>
  );
};

export default App;

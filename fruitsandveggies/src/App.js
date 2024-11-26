import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";

const App = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://fruit-and-veg-detection-1.onrender.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Prediction response:", response);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Failed to get prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Fruits & Vegetables Recognition
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Upload an image to predict whether it's a fruit or vegetable.
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                color="primary"
                sx={{ textTransform: "none" }}
              >
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
            </Grid>
            {preview && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={preview}
                  alt="Selected Preview"
                  sx={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    marginTop: "20px",
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{
                  marginTop: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Predict"}
              </Button>
            </Grid>
          </Grid>
        </form>
        {prediction && (
          <Box mt={4}>
            <Typography variant="h5" sx={{ color: "success.main" }}>
              Prediction: {prediction}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default App;

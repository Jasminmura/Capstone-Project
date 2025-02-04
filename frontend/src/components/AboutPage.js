import React from 'react';

function AboutPage() {
  return (
    <div className="card mb-4 border-0" style={{ backgroundColor: '#2b2b2b' }}>
      <div className="card-header bg-dark text-light">
        <h4 className="mb-0">About This Project</h4>
      </div>
      <div className="card-body" style={{ color: '#ccc' }}>
        <p>
          <strong>Overview:</strong> Our application provides weather forecasts
          by leveraging <strong>K-Means clustering</strong> on historical
          weather data. We’ve harnessed reanalysis data (e.g., ERA5) across
          multiple parameters such as temperature, wind speed, moisture, and
          probability of rain to build robust models.
        </p>

        <p>
          <strong>Data Pipeline:</strong> We ingest historical weather data, 
          normalize and segment it into meaningful time windows. Using 
          <em> K-Means </em>, we cluster these historical patterns. 
          For any new incoming data (defined by the user’s chosen day and 
          location), the model identifies which historical cluster it best 
          aligns with and yields a prediction based on those past outcomes.
        </p>

        <p>
          <strong>Key Benefits:</strong>
          <ul>
            <li>
              <strong>Clustering Accuracy:</strong> By grouping similar 
              historical weather patterns, we provide data-driven forecasts 
              rooted in proven past scenarios.
            </li>
            <li>
              <strong>Flexible Parameters:</strong> Our approach seamlessly 
              extends to temperature, rain probability, moisture, wind 
              speed, and other variables.
            </li>
            <li>
              <strong>Scalability:</strong> Whether you want a single-day 
              projection or a multi-day window, our K-Means engine handles 
              large data volumes effectively.
            </li>
          </ul>
        </p>

        <p>
          <strong>How It Works Under the Hood:</strong> 
          <ol>
            <li>
              <em>Data Normalization:</em> 
              Each weather parameter is normalized so that clustering 
              isn’t skewed by large numeric scales.
            </li>
            <li>
              <em>Clustering:</em> 
              K-Means categorizes different weather “signatures,” grouping 
              similar days into distinct clusters.
            </li>
            <li>
              <em>Prediction:</em> 
              For a chosen latitude, longitude, and day, we determine 
              the nearest cluster(s) from historical data and infer 
              likely conditions based on those prior patterns.
            </li>
          </ol>
        </p>

        <p>
          This entire project demonstrates how <em>K-Means clustering</em> can 
          enhance weather insights by comparing current conditions with 
          historically similar patterns. From front-end visualization to 
          back-end data science, we’ve combined location-based input, 
          daily references, and cluster-driven predictions into one 
          seamless application.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
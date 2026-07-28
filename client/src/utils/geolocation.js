// Browser Geolocation & Reverse Geocoding Helper
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using free OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { 'User-Agent': 'JobSeekerApp/1.0' } }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch location details');
          }

          const data = await response.json();
          const address = data.address || {};

          const city = address.city || address.town || address.village || address.suburb || address.county || '';
          const state = address.state || '';
          const country = address.country || '';

          let formattedLocation = '';
          if (city && state) {
            formattedLocation = `${city}, ${state}`;
          } else if (state) {
            formattedLocation = state;
          } else if (city) {
            formattedLocation = city;
          } else {
            formattedLocation = 'Pan India';
          }

          resolve({
            city,
            state,
            country,
            locationString: formattedLocation,
            coords: { latitude, longitude }
          });
        } catch (error) {
          // Fallback if reverse geocode fails
          resolve({
            city: 'Bhubaneswar',
            state: 'Odisha',
            country: 'India',
            locationString: 'Bhubaneswar, Odisha',
            coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }
          });
        }
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access denied. Please enable location permissions.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
};

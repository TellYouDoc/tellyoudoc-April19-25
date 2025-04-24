/**
 * API utility functions for pincode lookup
 */

/**
 * Fetches address details from the India Post API using a pincode
 * @param {string} pincode - The 6-digit Indian postal code
 * @returns {Promise} - Promise resolving to address details object
 */
export const fetchAddressByPincode = async (pincode) => {
  try {
    // Validate pincode format (6 digits)
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      throw new Error('Invalid pincode format. Must be 6 digits.');
    }

    // Use India Post Pincode API (free and public)
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check API response format
    if (!data || data.length === 0 || data[0].Status !== 'Success') {
      throw new Error('No data found for this pincode');
    }

    // Extract relevant information from the response
    const postOffices = data[0].PostOffice || [];
    
    if (postOffices.length === 0) {
      throw new Error('No post offices found for this pincode');
    }

    // Get the first post office data (most relevant)
    const postOffice = postOffices[0];
    
    // Return formatted address details
    return {
      state: postOffice.State,
      district: postOffice.District,
      postOffice: postOffice.Name,
      taluka: postOffice.Block,
      division: postOffice.Division,
      region: postOffice.Region,
      circle: postOffice.Circle,
      allPostOffices: postOffices.map(po => po.Name)
    };
  } catch (error) {
    console.error('Error fetching pincode data:', error);
    throw error;
  }
};
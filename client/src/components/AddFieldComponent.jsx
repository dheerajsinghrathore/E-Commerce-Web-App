import React from "react";

function AddFieldComponent() {
  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Additional Fields</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="moreDetails">
              More Details (JSON)
            </label>
            <textarea
              id="moreDetails"
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="4"
              placeholder='e.g., {"key":"value"}'
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="publish">
              Publish
            </label>
            <select
              id="publish"
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Add Fields
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddFieldComponent;

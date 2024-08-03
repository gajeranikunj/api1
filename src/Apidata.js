import { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';

const Apidata = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null); // To store selected data for update
  const url = "https://service.apikeeda.com/api/v1/contact-book";
  const token = "y1722244578630vna507072450yx";//add token if not found

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(url, {
      headers: {
        "x-apikeeda-key": token
      }
    }).then((response) => {
      console.log('GET response:', response);
      setData(response.data.data);
    }).catch((error) => {
      console.error('GET error:', error);
    });
  };

  const postData = (values) => {
    axios.post(url, values, {
      headers: {
        "x-apikeeda-key": token
      }
    }).then((response) => {
      console.log('POST response:', response.data);
      getData();
    }).catch((error) => {
      console.error('POST error:', error);
    });
    
  };

  const updateData = (id, values) => {
    axios.patch(`${url}/${id}`, values, {
      headers: {
        "x-apikeeda-key": token
      }
    }).then(() => {
      getData();
      setSelectedData(null); // Clear the form after update
    }).catch((error) => {
      console.error('UPDATE error:', error);
    });
  };

  const deleteData = (id) => {
    axios.delete(`${url}/${id}`, {
      headers: {
        "x-apikeeda-key": token
      }
    }).then(() => {
      getData();
    }).catch((error) => {
      console.error('DELETE error:', error);
    });
  };

  return (
    <>
      <div style={{width:"90%",margin:"10px auto"}}>
        <h1>{!selectedData ? "Sign Up" : "Update"}</h1>
        {
          <Formik
            initialValues={!selectedData ? {
              firstName: "",
              lastName: "",
              mobileNo: "",
              email: "",
              nickName: ""
            } : selectedData}
            enableReinitialize={true}//imp
            onSubmit={async (values,{resetForm}) => {
              if (selectedData) {
                updateData(selectedData._id, values);
              } else {
                postData(values);
              }
              resetForm();
              setSelectedData(null)
            }}
          >
            <Form>
              <label htmlFor="firstName">First Name</label>
              <Field id="firstName" name="firstName" placeholder="Jane" />

              <label htmlFor="lastName">Last Name</label>
              <Field id="lastName" name="lastName" placeholder="Doe" />

              <label htmlFor="nickName">Nick Name</label>
              <Field id="nickName" name="nickName" placeholder="Doe" />

              <label htmlFor="mobileNo">Mobile No</label>
              <Field id="mobileNo" name="mobileNo" placeholder="1234567890" />

              <label htmlFor="email">Email</label>
              <Field id="email" name="email" placeholder="jane@acme.com" type="email" />
              <button type="submit">{!selectedData ? "Submit" : "Update"}</button>
            </Form>
          </Formik>
        }
      </div>

      <table style={{width:"90%",margin:"10px auto"}} border={"1px"}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile No</th>
            <th>Email</th>
            <th>Nick Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, ind) => (
            <tr key={ind}>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.mobileNo}</td>
              <td>{item.email}</td>
              <td>{item.nickName}</td>
              <td style={{display:"flex",justifyContent:"space-evenly"}}>
                <button onClick={() => deleteData(item._id)}>Delete</button>
                <button onClick={() => setSelectedData(item)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Apidata;

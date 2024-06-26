import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Button, Col, Image, Card } from 'react-bootstrap';

import DeleteComponent from '../components/DeleteComponent';


import axios from 'axios';

const RecapTab = ({userId, eventId, eventCallback}) => {

  const [s3FileData, setS3FileData] = useState({metaData : [], userMatch : [], userName : []})
  const [initialDeletes, setInitialDeletes] = useState([])
  const [pullData, setPullData] = useState(true);
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileCaption, setFileCaption] = useState('')
  const [fileValidation, setFileValidation] = useState('')
  const [submissionValidation, setSubmissionValidation] = useState('')
  const [fileList, setFileList] = useState([])
  const [fileNameList, setFileNameList] = useState([])
  const [showRecap, setShowRecap] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentPostValidation, setCommentPostValidation] = useState('');
  const [userComment, setUserComment] = useState('');
  const [viewComments, setViewComments] = useState(false);
  const [doDelete, setDoDelete] = useState(false)

  console.log("Original user id in this class: ", userId)

  /* getting all the file data */
  useEffect(() => {
      // Make GET request to Node.js server
      axios.get(`http://ec2-3-133-58-38.us-east-2.compute.amazonaws.com:8000/api/eventRecap/${userId}/${eventId}`)
        .then(data => {
          setS3FileData(data.data);
          console.log("In useEffect - what is the file data result from the server?");
          console.log(data.data);
          /* for (let i = 0; i < ) */
          console.log("Number of recaps IN USE EFFECT: ", data.data.metaData.length);

          // create array to add to the state array
          const initialDeletesArray = []
          for (let i = 0; i < data.data.metaData.length; i++){
            initialDeletesArray.push(false);
          }

          // add the array
          setInitialDeletes(initialDeletesArray);

        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, [pullData]);

  const handleFileChange = (e) => {

    // must reset the file and its name fisrt thing
    setFile(null);
    setFileName('');

    if (e.target.value === undefined || e.target.files === undefined){
      return false;
    }

    console.log("Option 1 for setting the file: ")
    console.log(document.getElementById("fileUploaded").value);
    console.log("Option 2 for setting the file: ")
    console.log(e.target.value.split("\\")[2])

    const supportedFileTypes = ['jpg', 'jpeg', 'png', 'svg', 'mp4', 'mov', 'avi', 'wmv', 
    'JPG', 'JPEG', 'PNG', 'SVG', 'MP4', 'MOV', 'AVI', 'WMV'];

    // Reset the validation for the file
    setFileValidation('');

    const currentFileName = e.target.value.split("\\")[2];

    if (currentFileName === undefined){
      return false;
    }

    let periodCount = 0;

    for (let i = 0; i < currentFileName.length; i++){
      if (currentFileName.charAt(i) === '\\' || currentFileName.charAt(i) === '/'){
          setFileValidation("Invalid file type. File cannot contain the characters '\\' or '/'");
          return false;
      }
      if (currentFileName.charAt(i) === '.'){
          periodCount++;
          if (periodCount >= 2){
              setFileValidation("Invalid file type. File cannot contain more than one period");
              return false;
          }
      }

    }

    console.log("NOW what is the value of the current file name?: ", currentFileName)
    console.log(currentFileName)

  // In addition to setting the image, you have to mark that in this case, you starting over with the image, and therefore, it hasn't been uploaded yet
  const currentFile = e.target.files[0];
  if (currentFile){

      const fileExtension = currentFileName.split(".")[1]
      // If not in the supported types, set a validation message
      if (supportedFileTypes.indexOf(fileExtension) === -1){
          console.log("In the file extension validator - the file extension is - ", fileExtension)
          console.log("The current file name is ", currentFileName)
          setFileValidation("Invalid file type. Supported file types are 'jpg', 'jpeg', 'png', 'svg', 'mp4', 'mov', 'avi', 'wmv'.");
      }
      // otherwise, add the file to the list of files, as well as the STRING list of file NAMES
      else {
          ////setFileList([...fileList, currentFile]);
          ////setFileNameList([...fileNameList, currentFileName]);
          setFile(currentFile);
          setFileName(currentFileName);
      }
    }
    else {
      setFile(null);
    }
  };

  const recapToggle = () => {
    setShowRecap(!showRecap);
  }

  const handleFileSubmit = (e) => {
      e.preventDefault();

      // set the submission validation here (you must have all of a caption and a file)
      if (fileCaption === ''){
        setSubmissionValidation("Invalid submission. your submission must include both a caption and a media file");
      }

          const fileData = new FormData();
          fileData.append('userId', userId);
          fileData.append('eventId', eventId);
          fileData.append('file', file);
          fileData.append('fileExtension', fileName.split(".")[1]);
          fileData.append('caption', fileCaption);

          axios.post(`http://ec2-3-133-58-38.us-east-2.compute.amazonaws.com:8000/api/eventRecap`, fileData
          , {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
          
          })
          .then(response => {
              // Handle success, if needed
              console.log("Create image response: ");
              console.log(response.data);

              setFile(null);
              setFileName('');
              setSubmissionValidation('');

              // after everything happens, reload the page
              setPullData(!pullData)
            })
          .catch(error => {
            // Handle error, if needed
            console.error(error);
          });
      
          recapToggle();
          
  }

  const handleFileCaptionChange = (e) => {
    setFileCaption(e.target.value);
  }

  let metadataToDelete;
  const handleDelete = () => {
    const response = axios.delete(`http://ec2-3-133-58-38.us-east-2.compute.amazonaws.com:8000/api/eventRecap/${metadataToDelete}`)
    console.log(response);
  }

  const toggleDoDelete = () => {
    setDoDelete(!doDelete)
  }

    return (
        <div style={{ marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
            
            {(showRecap === false) ?

            (<Container>
              <Button 
              variant="primary" 
              onClick={recapToggle} 
              style={{ marginLeft: '79%', borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', fontSize: '15px', marginBottom: '20px' }}>Create Recap</Button>
            </Container>
            ) :
            (<div>
                <Container>
                  <Form>
                  <Row>
                    <Col>
                   
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Image (Optional)</Form.Label>
                    <Form.Control type="file" id="fileUploaded" onChange={handleFileChange} />
                  </Form.Group>
                
                </Col>
                  <Col>
                <Form.Group controlId="formTitle">
                <Form.Label>Caption</Form.Label>
                    <Form.Control 
                    type="text"  
                    id="fileCaption"
                    placeholder="Add a caption for your image upload"
                    value={fileCaption}
                    onChange={handleFileCaptionChange}
                required />
                 </Form.Group>
                 </Col>
                 
                {/* <input 
                    type="text" 
                    id="fileCaption"
                    placeholder="Add a caption for your image upload"
                    value={fileCaption}
                    onChange={handleFileCaptionChange}
                required /> */}
                </Row>
                
                {fileValidation}

                
                  <Button
                    style={{ borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', marginLeft:'92%', marginBottom:'20px'}}
                    onClick={handleFileSubmit}>Submit</Button>     
                
                {submissionValidation}
                </Form>
                </Container>                      
            </div>)}

            {/*Map all of the recap items to cards*/}

            {/* Note: if ynot contained the metadata, you need to reference directly from the S3 data returned*/}
            {/* style={(Recap.fileKey === undefined) ? ({ fontSize: '16px', width: '620px', height: '1000px' }) : ({ fontSize: '16px', width: '620px', height: '1000px' })*/}

            {(s3FileData.metaData === undefined) ? (<></>) : (<div>{s3FileData.metaData.map((Recap, index) => (<Card style={{  marginLeft: '10%',  marginRight: '10%', marginBottom: '2%' }}>
            <Card.Body style={{ width: '100%', height: '100%' }}>
              <Container>
                <Row>
                <Col xs={1}>
                {s3FileData.userName.image ? 
                  <Image src={s3FileData.userName.image} style={{ width: '40px' }} /> :
                  <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF26T5HCESNKfp-xIPUMqH87CfB6zVdkH_y_F7bs9EZoUyKVrUKxX9ghVF9x--pUzb_1w&usqp=CAU' style={{ width: '40px' }} />
                }
                </Col>
                <Col xs={11}>
                  <div>
                    <b>{s3FileData.userName[index]}</b>
                  </div>
                  <div style={{ fontSize: '13px', color: 'gray' }}>
                    {new Date(Recap.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </Col>
                </Row>
                <Row style={{ marginLeft: '2px', marginTop: '7px', marginBottom: '8px'}}>
                  {/* Description*/}
                  {Recap.caption}
                </Row>
                  {/* Images (conditional)*/}
                  {(Recap.imageUrl === undefined) ? (<></>) : (<img src={Recap.imageUrl} alt={"image"} style={{ width: '100%', marginRight: '10px', marginBottom: '10px'}} />)}
                  {/* Button for adding a comment */}
                <Row>
                <Col>
                  {/* Delete button (conditional)*/}
                  {(s3FileData.userMatch[index] === false || initialDeletes[0] === undefined) ? (<></>) :                   
                  (<form onSubmit={async (e) => {
                    e.preventDefault();
                     // callback after reloading
                    eventCallback("recap");
                    // better idea than reloading: just set a trigger for pulling all the recaps, and then you don't need to go back to the event page and set the state (just stysa on the recap tab)
                    let initialDeletesTemp = initialDeletes;
                    
                        initialDeletesTemp[index] = false;
                    setInitialDeletes([...initialDeletes]);
                  await axios.delete(`http://ec2-3-133-58-38.us-east-2.compute.amazonaws.com:8000/api/eventRecap/${Recap._id}`);
                  // after deleting, pull again
                  setPullData(!pullData);
                 
                  }}>

                    {/* Try to define initial delete as a variable only for the mapping */}
                    

                    {/* Method of passing parameter from here - likely conditionally call a form for doing delete, and make them form return by setting do delete as false*/}
                    <Button onClick={() => {let initialDeletesTemp = initialDeletes;
                      console.log("As we're setting it, what is the length: ", initialDeletesTemp.length)
                      // Only set to true when you get to the index
                      initialDeletesTemp[index] = true;
                      console.log("Is it true now?: ", initialDeletesTemp[index])
                      setInitialDeletes([...initialDeletes]);
                      console.log("But what about actually AT the index?: ", initialDeletes[index])
                      }} style={{borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', fontSize: '15px'}}>Delete Recap</Button>

                    {/* Any time you set the initial delete, you have to eventually set it as false somewhere */}

                    {/* Only show the "delete post" button if the inital delete has been checked (is true), and otherwise, show a cencel button*/}
                    {(initialDeletes[index] === false) ? (<div></div>) : (
                    <div style={{marginTop:'5px'}}>
                    <p>Are you sure you want to delete this post?</p>
                    <Button type="submit" style={{borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', marginRight: '5px'}}>Yes</Button>
                    <Button onClick={() => {let initialDeletesTemp = initialDeletes;
                        initialDeletesTemp[index] = false;
                        setInitialDeletes([...initialDeletes]);
                    }}style={{borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', marginLeft: '2px'}}>No</Button> 
                    </div>)}
                  </form>)}
                  {/* <div>{(doDelete === true) ? (<div></div>) : (<DeleteComponent metadata={Recap._id} returnFunction={toggleDoDelete}/>)}</div> */}
                  </Col>
                  <Col>
                  
                  {(showCommentForm === false) ?
                      ( <Button 
                          variant="primary" 
                          onClick={() => setShowCommentForm(!showCommentForm)} 
                          style={{ borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', fontSize: '15px', marginBottom: '20px', width: '130px', marginRight: '10px', marginLeft: '25%' }}>Add comment</Button>
                      ) : null }
                      {(viewComments === false) ? 
                        <Button 
                        variant="primary" 
                        onClick={() => setViewComments(true)} 
                        style={{ borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', fontSize: '15px', marginBottom: '20px',  width: '140px' }}>View comments</Button> : 
                      // map over the comments (if they exist)
                      (<></>)}
                      </Col>
                </Row>    
              </Container>


            </Card.Body>

            {/* Comment add form (in a new nested card beow the other one) */}
            {(showCommentForm === false) ? (<></>) : 
            (<Card>
              <Card.Body>
            <Container>
              <Form>
              <Row> 
              {/* <Col> */}
            <Form.Group controlId="formTitle">
            <Form.Label>Comment</Form.Label>
                <Form.Control 
                type="text"  
                id="fileCaption"
                placeholder="Write a Comment"
                value={userComment}
                onChange={(e) => {setUserComment(e.target.value)}}
            required />
             </Form.Group>
             {/* </Col> */}
             </Row>
             <Row style={{marginTop: '10px'}}>
              <Col></Col>

              <Col>
              
              <Button
                style={{ borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', width: '145px', marginRight: '10px', fontSize: '15px', marginLeft: '32%'}}
                onClick={() => {
                    setCommentPostValidation('');
                    // First set validation if nothing is entered
                    if (userComment === ''){
                      setCommentPostValidation("Please enter text for your comment");
                      return false;
                    }
                    // Params: metadata id
                    // Body: userId, commentString
                    axios.post(`http://ec2-3-133-58-38.us-east-2.compute.amazonaws.com:8000/api/eventRecap/createComment/${Recap._id}`, {userId : userId, commentString : userComment})
                     .then(response => {
                         // Handle success, if needed
                         console.log("Post comment response: ");
                         console.log(response.data.message);

                         setUserComment('');
                         setCommentPostValidation('');

                         // after everything happens, reload the page
                         setPullData(!pullData)
                       })
                     .catch(error => {
                       // Handle error, if needed
                       console.error(error);
                     });
                }}>Post Comment</Button>
                <Button
                style={{ borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', width: '100px',  fontSize: '15px'}}
                onClick={() => {setShowCommentForm(false)}}>Cancel</Button>

            {commentPostValidation}
            </Col>
            </Row>     
              
            </Form>

          
            </Container>   
            </Card.Body>
            </Card>)}

            {/*Comment view form (in another lower-nested card) */}
            {(viewComments === false) ? (<></>) : 
            (<Card>
              <Card.Body>
              {
                <div>
                <p>Comments</p>
                {(Recap.comments === undefined) ?
                (<></>) :
                (<div>
                 
                  {Recap.comments.map((comment, index2) => (<Card>
                  
                  <Card.Body>
                    {/* Display the first and last name at the index of the comment (index referring to stuff within the metadata*/}
                    <b>{Recap.commentUsernames[index2]}</b>
                    {/* Display the comment post */}
                    <br/>{comment}

                  </Card.Body>

               </Card>

                ))}</div>)}
                </div>
              }
              <Button 
              style={{ borderColor: '#A39A9A', backgroundColor: "transparent", color: '#4D515A', width: '100px',  fontSize: '15px', marginTop: '10px', marginLeft: '87%'}}
              onClick={() => setViewComments(false)}>Close</Button>
            </Card.Body>
            </Card>)}


            </Card>))}</div>)}
            {/* New thing - do a conditional rendering for each card in the mapping (if the image of the recap ojbect is undefined, make the height 500 instead of 1000*/}

            

            

            
            
        </div>
    );
}

/* 

{/*Map all of the recap items to cards 

{(s3FileData.metaData === undefined) ? (<></>) : (<div>{s3FileData.metaData.map((Recap, index) => (<Card style={{  marginLeft: '20px' }}>
<Card.Body style={{ fontSize: '12px', width: '620px' }}>
  <p>Recap published by user {Recap.user}</p>
</Card.Body>
</Card>))}</div>)}

*/

export default RecapTab;
import React from 'react';
import { Navbar, Nav, Image, Container, Row, Col, Form, Button } from 'react-bootstrap';

function SignupPage() {
    return (
        <div>
        <Navbar expand="lg" className="px-lg-5 fixed-top" style={{ paddingTop: '15px', zIndex: '1000', backgroundColor: '#fff', fontFamily: 'Arial' }}>
        <Navbar.Brand>
        <NavLink href="/" >
          <Image
            src={process.env.PUBLIC_URL + '/logo.png'}
            alt="Logo"
            style={{ maxHeight: '45px', paddingRight: '15px'}}
          />
          {/* Brand name */}
          <span style={{ color: '#4D515A', fontSize: '21px' }}>Potluck</span>
        </NavLink>
        {/* Logo */}
        </Navbar.Brand>
        </Navbar>
        <Container style={{paddingRight: '26%', paddingLeft: '26%', paddingTop: '5%'}}>
            {/* Title */}
            <h2 style={{ fontFamily: 'Times New Roman', fontSize: '50px', marginBottom: '15px' }}>Create an Account</h2> <br />
            <Form> 
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                        <Col>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" />
                        </Col>
                    </Row>
                </Form.Group> <br />    
                <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="text" />
                </Form.Group>  <br />           
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" />
                </Form.Group> <br />     
                <Button
                    variant="primary"
                    type="submit"
                    style={{
                        backgroundColor: '#E8843C', 
                        borderColor: '#E8843C', 
                        borderRadius: '30px', 
                        fontFamily: 'Arial', 
                        paddingLeft: '15px', 
                        paddingRight: '15px', 
                        marginRight: '60px',
                        width: '100%',
                        height: '42px'
                    }}>
                    Create an Account
                </Button> <br /><br />
                <p style={{textAlign: 'center'}}>
                    Already have an account? 
                    <a href='/signin' style={{margin: '5px', color: 'black', fontWeight: 'bold'}}>Sign In</a>
                </p>     
            </Form>
        </Container>
        </div>
        
    );
}

// NavLink component definition
const NavLink = ({ href, isActive, children }) => (
    // Nav link with style and children
    <Nav.Link href={href} style={{ fontWeight: isActive ? 'bold' : '', paddingRight: '45px' }}>
      {/* Link text */}
      <span style={{ fontFamily: 'Arial', color: '#4D515A', fontSize: '17px' }}>{children}</span>
    </Nav.Link>
  );

export default SignupPage;

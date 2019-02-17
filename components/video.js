import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


class Video extends React.Component {
  render() {
  		// Getting Dynamic Demo Pages Data
  		let VideoList = this.props.videos.map((val, i) => {
  			return (
	  			<div className="col-xl-4 col-lg-6 col-sm-12 text-center" key={i}>
	  				<div key={i}>
							<div className="embed-responsive embed-responsive-16by9">
								<iframe className="embed-responsive-item" src={val.src} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
							</div>
	          </div>
	          <h2 className="demo-title">{val.label} </h2>
          </div>
        );
  		});

    return (
      <section className="fadinup" id="home-demo">
		      <div className="container-fluid m-width">
		        <div className="row">
		           <div className="col-md-12">
		             <h2 className="landing-title">understand thy cars</h2>
		             <div className="border-shape"></div>
		           </div>
		           <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1">
							 	<p className="demo-description"><h3>You don't have to get taken advantage of.<br/>Let me teach you about cars so you're better equipped at the dealership or car repair shop.</h3></p>
		           </div>
		        </div>
		        <div className="row mt-35 landing-screen-animation">
		            {VideoList}
		        </div>
		      </div>
		    </section>
      );
  	}
 }

 export default Video;

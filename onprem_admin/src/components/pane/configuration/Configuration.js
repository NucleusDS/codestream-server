'use strict';

import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Router } from '@reach/router';
import Topology from './topology/Topology';
import General from './general/General';
import Email from './email/Email';
import Integrations from './integrations/Integrations';
import History from './history/History';
// import Actions from '../../../store/actions/presentation';

class Configuration extends React.Component {
	render() {
		return (
			<section className="Configuration layout-configuration container-fluid">
				<div className="row justify-content-center">
					<section className="layout-pane-configuration-content col-12">
						<Router>
							<Topology path="topology" />
							<General path="general" />
							<Email path="email" />
							<Integrations path="integrations" />
							<History path="history" />
						</Router>
					</section>
				</div>
			</section>
		);
	}
}

// Configuration.propTypes = {
// 	sectionData: PropTypes.array.isRequired
// };

export default Configuration;

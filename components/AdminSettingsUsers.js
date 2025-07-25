'use strict';

const React = require('react');

const {
  Button,
  Table,
  Message,
  Header,
  Segment,
  Statistic,
  Input,
  Modal,
  Popup,

} = require('semantic-ui-react');

const SignUpForm = require('./SignUpForm');
const UsernameEditModal = require('./AdminSettingsUsernameModal');
const EmailEditModal = require('./AdminSettingsEmailModal');
//const { email } = require('../settings/local');

class AdminUsers extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      searchQuery: '',
      usernameEditModal: false, //to open de username edit modal
      userIdEditing: null,
      usernameEditing: '',
      confirmResetOpen: false,
      emailReseting: null,
      reseting: false,
      emailEditing: null,
      editEmailOpen: false,
      createUserModalOpen: false
    };
  }

  componentDidMount () {
    this.props.fetchUsers();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.accounts !== this.props.accounts) {
      if (this.state.reseting && !this.props.accounts.loading && (this.props.accounts.error || this.props.accounts.passwordReseted)) {
        this.setState({ reseting: false });
      }
    }
  };

  formatDateTime (dateTimeStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeStr).toLocaleString('en-US', options);
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  reloadUsers = async () => {
    await this.props.fetchUsers();
  }

  // Toggle username modal
  toggleUsernameModal = () => {
    this.setState(prevState => ({
      usernameEditModal: !prevState.usernameEditModal
    }));
  };
  // Toggle email the modal
  toggleEmailModal = () => {
    this.setState(prevState => ({
      editEmailOpen: !prevState.editEmailOpen
    }));
  };

  toggleCreateUserModal = () => {
    this.setState(prevState => ({
      createUserModalOpen: !prevState.createUserModalOpen
    }));
  };

  changeUsername = (oldUsername, id) => {
    this.setState({ usernameEditing: oldUsername, userIdEditing: id, usernameEditModal: true });
    // this.toggleUsernameModal;
  }

  changeEmail = (oldEmail, id) => {
    this.setState({ emailEditing: oldEmail, userIdEditing: id, editEmailOpen: true });
  }
  confirmResetPassword = (email) => {
    this.setState({ emailReseting: email, confirmResetOpen: true });
  }

  renderConfirmResetModal = () => {
    const { accounts, users } = this.props;
    const { confirmResetOpen, emailReseting } = this.state;
    return (
      <Modal
        open={confirmResetOpen}
        size='tiny'
        onClose={() => this.setState({ confirmResetOpen: false, emailReseting: null })}
      >
        <Modal.Content>
          <p>Do you want to send a reset link to: <strong>{emailReseting}</strong> ?</p>
        </Modal.Content>
        <Modal.Actions>
          {(users.passwordReseted && users.currentEmail === emailReseting) &&
            <Message positive content='Password reset link sent' />
          }
          {(users.error && users.currentEmail === emailReseting) &&
            <Message negative content={users.error} />
          }
          <Button.Group>
            <Button secondary onClick={() => this.setState({ confirmResetOpen: false })}>Close</Button>
            <Button primary onClick={() => { this.props.askPasswordReset(emailReseting); this.setState({ reseting: true }) }} loading={this.state.reseting}>Send</Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  }

  renderCreateUserModal = () => {
    return (
      <Modal
        open={this.state.createUserModalOpen}
        onClose={this.toggleCreateUserModal}
        size="small"
      >
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Content>
          <SignUpForm
            adminPanel={true}
            checkInvitationToken={this.props.checkInvitationToken}
            checkUsernameAvailable={this.props.checkUsernameAvailable}
            checkEmailAvailable={this.props.checkEmailAvailable}
            auth={this.props.auth}
            invitation={this.props.invitation}
            fullRegister={this.props.fullRegister}
            onSuccess={this.toggleCreateUserModal}
          />
        </Modal.Content>
      </Modal>
    );
  };

  render () {
    const { accounts, users, stats } = this.props;
    const {
      searchQuery,
      userIdEditing,
      usernameEditing,
      editEmailOpen,
      emailEditing,
      usernameEditModal
    } = this.state;

    const inquiriesTotal = stats?.inquiries?.total ?? 0;
    // const invitationsTotal = stats?.invitations?.total ?? 0;
    const usersTotal = stats?.accounts?.total ?? 0;

    return (
      <section className='fade-in users-section'>
        <div>
          <Header as='h4'>Metrics</Header>
          <div>
            <Statistic>
              <Statistic.Value>{usersTotal}</Statistic.Value>
              <Statistic.Label>Users</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>{inquiriesTotal}</Statistic.Value>
              <Statistic.Label>Waitlisted</Statistic.Label>
            </Statistic>
          </div>
        </div>
        <div className='users-section-head'>
          <Header as='h4'>Users</Header>
          <br style={{ clear: 'both' }} />
          <div>
            <Button primary onClick={this.toggleCreateUserModal}>Create User</Button>
            <Button
              icon='redo'
              title='Update users'
              size='medium'
              onClick={this.reloadUsers}
              basic
              style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
            />
            <Input
              icon='search'
              placeholder='Find by email/username'
              name='searchQuery'
              onChange={this.handleInputChange}
              style={{ marginLeft: '20px' }}>
            </Input>
          </div>
        </div>
        <Segment style={{ overflow: 'auto', maxHeight: '40vh', padding: '0' }} loading={this.props.accounts.loading}>
          <Table celled striped compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center" width={1}>ID</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" width={2}>Username</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" width={1}>Is Admin</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" width={2}>Email</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" width={3}>Created</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" width={4}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {accounts && Array.isArray(accounts.users) && accounts.users
                .filter(instance =>
                  (instance.email ? (instance.email.toLowerCase().includes(searchQuery.toLowerCase())) : (searchQuery ? false : true)) ||
                  (instance.username.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(instance => {
                  return (
                    <Table.Row key={instance.id}>
                      <Table.Cell textAlign="center">{instance.id}</Table.Cell>
                      <Table.Cell textAlign="center">{instance.username}</Table.Cell>
                      <Table.Cell textAlign="center">{instance.is_admin ? 'Yes' : 'No'}</Table.Cell>
                      <Table.Cell textAlign="center">{instance.email ? instance.email : null}</Table.Cell>
                      <Table.Cell textAlign="center">{this.formatDateTime(instance.created_at)}</Table.Cell>
                      <Table.Cell textAlign="center">
                        <Button.Group>
                          <Popup
                            content="Add/Change Email"
                            trigger={
                              <Button
                                icon='at'
                                disabled={false}
                                onClick={() => this.changeEmail(instance.email, instance.id)}
                              />
                            }
                          />
                          <Popup
                            content="Send password reset"
                            trigger={
                              <Button
                                icon='key'
                                disabled={false}
                                onClick={() => this.confirmResetPassword(instance.email)}
                              />
                            }
                          />
                          <Popup
                            content="Change Username"
                            trigger={
                              <Button
                                icon='user'
                                disabled={false}
                                onClick={() => this.changeUsername(instance.username, instance.id)}
                              />
                            }
                          />
                          {/* <Popup
                            content="Disable User - Comming soon"
                            trigger={
                              <Button
                                icon='ban'
                                disabled={false}
                              />
                            }
                          /> */}
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
            </Table.Body>
          </Table>
        </Segment>
        {this.renderConfirmResetModal()}
        {this.renderCreateUserModal()}
        <EmailEditModal
          {...this.props}
          open={editEmailOpen}
          oldEmail={emailEditing}
          id={userIdEditing}
          toggleEmailModal={this.toggleEmailModal}
        />
        <UsernameEditModal
          {...this.props}
          open={usernameEditModal}
          id={userIdEditing}
          oldUsername={usernameEditing}
          toggleUsernameModal={this.toggleUsernameModal}
        />
      </section>
    );
  };
}


module.exports = AdminUsers;

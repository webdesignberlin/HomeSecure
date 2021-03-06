'use strict';

const firebase = require('firebase');
const createError = require('http-errors');
const Enrollee = module.exports = function(opts){

  this.id = opts.id; //what we use for subject_id in API call
  this.name = opts.name;  //asteetic update
  this.img = opts.img; //actual photo
  this.password = opts.password;
};
Enrollee.fetchAll = function(){
  return firebase.database().ref('/enrollee').once('value')
  .then(snapShot => {
    let data = snapShot.val();
    let enrollee = Object.keys(data).map(key => data[key]);
    return enrollee;

  });
};
Enrollee.findByIdAndDelete = function(id){
  return firebase.database().ref('/enrollee')
  .child(id).remove()
  .then( () => firebase.auth().signOut())
  .catch(err => {
    firebase.auth().signOut();
    throw err;
  });
};
Enrollee.findById = function(id){
  let value;
  return firebase.database().ref('/enrollee').once('value')
  .then(snapShot => {
    let data = snapShot.val();
    value= data[id];
  })
  .then(() => firebase.auth().signOut())
  .then(() => value)
  .catch(err => {
    firebase.auth().signOut();
    throw err;
  });
};

Enrollee.prototype.validate = function(){
  if(!this.id || !this.password || !this.name)
    return Promise.reject(createError(400, 'missing a required property'));
  return Promise.resolve();
};
Enrollee.prototype.save = function(){
  return this.validate()
  .then( () => {
    return firebase.database().ref('/enrollee')
    .child(this.id).set(this);
  })
  .then(() => {
    return firebase.auth().signOut();
  })
  .then(() => this)
  .catch(err => {
    firebase.auth().signOut();
    throw err;
  });
};

app.get('/updateStudent/teacher/:valId/:id', async(req, res) => {
    await studentSchema.findOne({s_Id : req.params.id },'Username Name Class Email Password', function (err, found) {
        if (err) return handleError(err);
        if(found !== null){
            res.render('updateStudent', { student : {
                s_Id : req.query.id,
                Name : found.Name,
                Class: found.Class,
                Email: found.Email,
                Password: found.Password,
                Username: found.Username
            }});
        }else{
            res.redirect('/login');
        }
    })
})

app.post('/updateStudent/teacher/:valId/:id', async(req, res) => {
    await studentSchema.findOneAndUpdate({ s_Id:req.body.id }, {
        Username: req.body.username,
        Name: req.body.name,
        Class: req.body.class,
        Email: req.body.email,
        Password: req.body.password 
    }, null, function(err){if(err) return handleError(err);})
})


app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login/student',(req, res) => {
    studentSchema.findOne({Username:req.body.username, Password: req.body.password },'s_Id Username Name Class Email Password', function (err, student) {
        if (err) return handleError(err);
        if(student !== null){
            res.redirect(`/classes/student/${student.s_Id}`);
        }
        else{
            res.redirect('/login');
        }
    })
})


app.get('/deleteStudent/teacher/:valId/:id', async(req, res) => {
    await studentSchema.findOneAndDelete({ s_Id : req.params.id}, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            res.send(data)
        }
    })
})


app.get('/addStudent/teacher/:valId', (req, res) => {
    res.render('addStudent', { student : {
        s_Id : "", 
        Name: "",
        Email: "",
        Class: "",
        Password : ""
    }});
})

app.post('/addStudent/teacher/:valId', async(req, res) =>{
    var data = await new studentSchema(jsonify(req.body.username, req.body.name, req.body.class, req.body.email, req.body.password))
    data.save().then(item => {
        res.send("item saved to database");
    }).catch(err => {
        console.log(err);
        res.status(400).send("unable to save to database");
    });
})
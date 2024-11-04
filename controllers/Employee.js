const CompanyProfile = require('../models/CompanyProfile');
const Employee = require('../models/Employee');

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, position, contactNumber, dateOfBirth, isContactPerson, companyId } = req.body;

    // Create new employee
    const employee = new Employee({ name, email, position, contactNumber, dateOfBirth, isContactPerson });

    // Save employee in the database
    const savedEmployee = await employee.save();

    // Add employee reference to company profile
    const company = await CompanyProfile.findById(companyId);
    company.employees.push(savedEmployee._id);
    await company.save();

    return res.status(200).json({
      success: true,
      message: 'Employee added successfully',
      employee: savedEmployee
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding employee', error });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, email, position, contactNumber, dateOfBirth, isContactPerson } = req.body;

    // Update the employee details
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, {
      name, email, position, contactNumber, dateOfBirth, isContactPerson
    }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating employee', error });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId, companyId } = req.params;

    // Remove the employee reference from the company profile
    const company = await CompanyProfile.findById(companyId);
    company.employees = company.employees.filter(empId => empId.toString() !== employeeId);
    await company.save();

    // Delete the employee from the Employee collection
    await Employee.findByIdAndDelete(employeeId);

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting employee', error });
  }
};

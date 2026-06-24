import { Action, ActionPanel, Form, showToast } from "@raycast/api"

type Values = {
    textfield: string
    textarea: string
    datepicker: Date
    checkbox: boolean
    dropdown: string
    tokeneditor: string[]
}

export default function Command() {
    function handleSubmit(values: Values) {
        console.log(values)
        showToast({
            title: "Submitted form",
            message: "See logs for submitted values"
        })
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.Description text="This form showcases all available form elements." />
            <Form.TextField
                defaultValue="Raycast"
                id="textfield"
                placeholder="Enter text"
                title="Text field"
            />
            <Form.TextArea
                id="textarea"
                placeholder="Enter multi-line text"
                title="Text area"
            />
            <Form.Separator />
            <Form.DatePicker id="datepicker" title="Date picker" />
            <Form.Checkbox
                id="checkbox"
                label="Checkbox Label"
                storeValue
                title="Checkbox"
            />
            <Form.Dropdown id="dropdown" title="Dropdown">
                <Form.Dropdown.Item
                    title="Dropdown Item"
                    value="dropdown-item"
                />
            </Form.Dropdown>
            <Form.TagPicker id="tokeneditor" title="Tag picker">
                <Form.TagPicker.Item
                    title="Tag Picker Item"
                    value="tagpicker-item"
                />
            </Form.TagPicker>
        </Form>
    )
}

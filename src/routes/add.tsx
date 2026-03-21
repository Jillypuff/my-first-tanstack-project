import { createFileRoute } from "@tanstack/react-router"
import AddApplicationForm from "#/components/application/AddApplicationForm"

export const Route = createFileRoute("/add")({ component: Add })

function Add() {
  return <AddApplicationForm />
}
